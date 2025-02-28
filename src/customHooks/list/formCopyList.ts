import { useState } from "react";
import { useListsStore } from "../../store/listsStore";
import { ListProps } from "../../types/boardProps";
import { useCardsStore } from "../../store/cardsStore";
import { useListsServices } from "../../services/listsServices";
import { useCardsServices } from "../../services/cardsServices";
import { useAuthContext } from "../useAuthContext";
import { addListTest, copyListAndUpdateOrderListsFirebase } from "../../services/firebase/updateData/updateLists";

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

    const copyList = ({idBoard, list, inputText}: {idBoard: string, list: ListProps, inputText: string}) => {
        const idListToCopy = list.idList;  //id a buscar
        const indexListGroup = listsGroup.findIndex(listGroup => listGroup.idBoard === idBoard);
        const indexListToCopy = listsGroup[indexListGroup].lists.findIndex(list => list.idList === idListToCopy);

        const idList = (Date.now() + list.nameList).toString();  //nuevo id para la lista copiada

        let listCopy = {
            ...list, 
            idList: idList,
            nameList: inputText
        }

        const indexTargetGroup = cardsGroup.findIndex(cardGroup => cardGroup.idBoard === idBoard && cardGroup.idList === idListToCopy);
        if (indexTargetGroup > -1) {
            const cards = cardsGroup[indexTargetGroup].cards;       //se copia las targets de la lista copiada con un nuevo idList 
            createCardGroup({idBoard, idList, cards});
        }

        //{   ESTA PARTE POSICIONA LA LISTA COPIADA JUSTO EN LA SIGUIENTE COLUMNA DE LA LISTA QUE SE COPIÓ
        const LISTS = [...listsGroup[indexListGroup].lists];          
        let updateLists: ListProps[] = [];

        for (let i = 0; i < LISTS.length; i++) {
            updateLists.push(LISTS[i]);
            if (i === indexListToCopy) {
                updateLists.push(listCopy);
            }
        }

        const indexListCopy = updateLists.findIndex(list => list.idList === listCopy.idList);
        if (indexListCopy > -1) {
            const prevList = updateLists[indexListCopy - 1];
            const postList = updateLists[indexListCopy + 1];
            let newOrder: number | undefined = undefined;

            if (prevList && postList) {
                newOrder = (prevList.order + postList.order) / 2;
            } else if (prevList) {
                newOrder = prevList.order + 10;
            }

            if (newOrder !== undefined) {
                updateLists = updateLists.map(list => list.idList === idList ? {...list, order: newOrder} : list);
                if (userAuth) addListTest({idBoard, list: {...listCopy, order: newOrder}});
            }
        }

        listsService({ 
            updateFn: (listsGroup) => listsGroup.map((listGroup) =>
                listGroup.idBoard === idBoard ?
                {...listGroup, lists: updateLists} :
                listGroup
            ),
        });
    }

    const callbackHandleCopyList = ({idBoard, list, inputText}: {idBoard: string, list: ListProps, inputText: string}) => {    //al apretar el boton de copiar se cierra el formulario de copiar lista y se cierra el modal de opciones de la lista
        copyList({ idBoard, list, inputText });
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