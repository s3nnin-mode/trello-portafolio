import { useState } from "react";
import { useListsStore } from "../../store/listsStore";
import { ListProps } from "../../types/boardProps";
import { useCardsStore } from "../../store/cardsStore";
import { useListsServices } from "../../services/listsServices";
import { useCardsServices } from "../../services/cardsServices";
import { useAuthContext } from "../useAuthContext";
import { addListFirebase, updateOrderListsFirebase } from "../../services/firebase/updateData/updateLists";
import { addCardFirebase } from "../../services/firebase/updateData/updateCards";
import { useTagsStore } from "../../store/tagsStore";
import { updateStateTag } from "../../services/firebase/updateData/updateTags";

interface UseFormCopyList {
  setIsModalOptionsActive: React.Dispatch<React.SetStateAction<boolean>>
}

export const useFormCopyList = ({ setIsModalOptionsActive }: UseFormCopyList) => {
  const { listsGroup } = useListsStore();
  const { cardsGroup } = useCardsStore();
  const { createCardGroup } = useCardsServices();
  const { listsService } = useListsServices();
  const [showFormCopyList, setShowFormCopyList] = useState(false);
  const { userAuth } = useAuthContext();
  const { tags, loadTags } = useTagsStore();

  const copyList = ({idBoard, listToCopy, inputText}: {idBoard: string, listToCopy: ListProps, inputText: string}) => {
    const listGroup = listsGroup.find(listGroup => listGroup.idBoard === idBoard)?.lists; 
    if (!listGroup) return;

    const newIdList = (Date.now() + 'copyList').toString();  //nuevo id para la lista copiada

    const listCopy = {
      ...listToCopy,
      idList: newIdList,
      nameList: inputText
    }

    //Esto posicion la lista copiada justo delante de la lista original
    let updatedLists: ListProps[] = [];

    for (let i = 0; i < listGroup.length; i++) {
      const currentList = listGroup[i]
      updatedLists.push(currentList);

      if (currentList === listToCopy) {
        const order = currentList && listGroup[i + 1] 
        ? (currentList.order + listGroup[i + 1].order) / 2 
        : currentList.order + 10;

        listCopy.order = order;
        updatedLists.push({...listCopy, order});

        if (userAuth) { //si el usuario está autenticado se agrega la lista copiada a firebase, ya si despues se reordena por duplicados o negativos la lista ya estará en disponible para firebase para reordenarla
          addListFirebase({idBoard, list: {...listCopy, order} })
        }
      }
    }

    //verificar si hay orders duplicados u order negativos
    const hasDuplicates = updatedLists.some((list, index, arr) => 
      arr.some((otherList, otherIndex) => otherIndex !== index && otherList.order === list.order));

    const hasNegativeOrders = updatedLists.some(list => list.order < 0);
    if (hasDuplicates || hasNegativeOrders) {
      updatedLists = updatedLists.map((list, index) => {
        const order = index === 0 ? 0 : index * 10;
        return {...list, order};
      });
      if (userAuth) updateOrderListsFirebase({ idBoard, updatedLists });
    }

    console.log('asi queda las lista cuando se copia', updatedLists);

    //Esto para copiar las cards de la lista a copiar
    copyCards({idBoard, idList: listToCopy.idList, newIdList});

    listsService({
      updateFn: (listsGroup) => listsGroup.map((listGroup) =>
        listGroup.idBoard === idBoard ?
        {...listGroup, lists: updatedLists} :
        listGroup
      )
    });
  }

  const copyCards = ({idBoard, idList, newIdList}: {idBoard: string, idList: string, newIdList: string}) => {

    let updateTags = [...tags];

    const cardsOfListToCopy = cardsGroup.find(cardGroup => 
      cardGroup.idBoard === idBoard && cardGroup.idList === idList)?.cards.map((card, index) => {
        const newIdCard = `copyCard${card.idCard}${Date.now()}`;
        const copyCard = {
          ...card, 
          idCard: newIdCard, 
          order: index === 0 ? 0 : card.order + 10
        }

        updateTags = updateTags.map((tag) => {
          if(tag.cardsThatUseIt.some(item => item.idCard === card.idCard)) {
            if (userAuth) { //si el usuario está autenticado se agrega la card copiada a 'cardsThatUseIt' de la tag para que las cards copiadas tengan activas esas tags tambien
              updateStateTag({
                idTag: tag.idTag,
                idBoard,
                idList: newIdList,
                idCard: newIdCard
              });
            }
            return {...tag, cardsThatUseIt: [...tag.cardsThatUseIt, { idBoard, idList, idCard: newIdCard}]}
          }
          
          return tag;
        });

        if (userAuth) { //si el usuario está autenticado se agrega cada card de la iteración a la lista copiada de firebase
          addCardFirebase({
            idBoard, //id de tablero a donde se copia la card
            idList: newIdList, //id de la lista a la cual se agregará la card copiada
            card: copyCard
          });
        }
        
        return copyCard;
      }
    );

    loadTags(updateTags);

    if (cardsOfListToCopy) {
      console.log('cardsOfListToCopy', cardsOfListToCopy);
      createCardGroup({
        idBoard, 
        idList: newIdList, 
        cards: cardsOfListToCopy
      });
    }
  }

  const callbackHandleCopyList = ({idBoard, list, inputText}: {idBoard: string, list: ListProps, inputText: string}) => {    //al apretar el boton de copiar se cierra el formulario de copiar lista y se cierra el modal de opciones de la lista
    // copyList({ idBoard, list, inputText });
    copyList({idBoard, listToCopy: list, inputText})
    setShowFormCopyList(false);
    setIsModalOptionsActive(false);
  }

  const openFormCopyList = () => {
    setIsModalOptionsActive(false);
    setShowFormCopyList(true);
  }

  const closeFormCopyList = () => {               //solo se cierra el form
    setShowFormCopyList(false);
    setIsModalOptionsActive(true);
  }

  const closeAllFormCopy = () => {           //se cierra form y modal de opciones
    setShowFormCopyList(false);
    setIsModalOptionsActive(false);
  }

  return { showFormCopyList, openFormCopyList, closeFormCopyList, closeAllFormCopy, callbackHandleCopyList }
}