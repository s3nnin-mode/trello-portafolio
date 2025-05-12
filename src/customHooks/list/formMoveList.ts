import { useState } from "react";
import { useListsStore } from "../../store/listsStore";
import { ListProps } from "../../types/boardProps";
import { useListsServices } from "../../services/listsServices";
import { updateOrderListsFirebase, updtateOrderList } from "../../services/firebase/updateData/updateLists";
import { useAuthContext } from "../useAuthContext";

interface UseFormMoveList {
  setIsModalOptionsActive: React.Dispatch<React.SetStateAction<boolean>>
}

export const useFormMoveList = ({ setIsModalOptionsActive}: UseFormMoveList) => {
  const { listsGroup } = useListsStore();
  const { listsService } = useListsServices();
  const [showFormMoveList, setShowFormMoveList] = useState(false);
  const { userAuth } = useAuthContext();
    
  const moveList = ({idBoard, list, position}: {idBoard: string, list: ListProps, position: number}) => {
    const indexListGroup = listsGroup.findIndex(listGroup => listGroup.idBoard === idBoard);
    const currentLists = listsGroup[indexListGroup].lists;
    const newLists = [...currentLists]; // Copia de las listas actuales

    // Eliminar la lista de su posición actual
    const currentIndex = newLists.findIndex(l => l.idList === list.idList);
    if (currentIndex > -1) {
      newLists.splice(currentIndex, 1);
    }

    // Insertar la lista en la nueva posición
    newLists.splice(position, 0, list);

    const listToMove = {...list}

    // Actualizar el orden de las listas
    const updatedLists = newLists.map((l, index) => {
      if (index === position) {
        const prevList = newLists[index - 1];
        const postList = newLists[index + 1];
        let order = 0;

        if (prevList && postList) {
          order = (prevList.order + postList.order) / 2;
          listToMove.order = order;
        } else if (prevList) {
          order = prevList.order + 10;
          listToMove.order = order;
        } else if (postList) {
          order = postList.order - 10;
          listToMove.order = order;
        }
        return {...l, order}
      }
      return l;
    });

    //hay que verificar si hay duplicados y valores negativos
    const hasDuplicates = updatedLists.some((list, index, arr) => 
      arr.some((otherList, otherIndex) => otherIndex !== index && otherList.order === list.order));

    const hasNegativeOrders = updatedLists.some(list => list.order < 0);

    if (hasDuplicates || hasNegativeOrders) {
      updatedLists.forEach((list, index) => {
        list.order = index * 10; 
      });
      if (userAuth) updateOrderListsFirebase({ idBoard, updatedLists }); //en caso de haber duplicados o negativos se reordena en firebase
    } else {
      if (userAuth) updtateOrderList({ idBoard, list: listToMove }); //si no hay duplicados u order negaivos se actualiza solo el order de la lista movida
    }

    listsService({
      updateFn: (listsGroup) => listsGroup.map((listGroup) =>
        listGroup.idBoard === idBoard
        ?
        { ...listGroup, lists: updatedLists }
        :
        listGroup
      )
    });
  }

  const openFormMoveList = () => {
    setIsModalOptionsActive(false);
    setShowFormMoveList(true);
  }

  const closeFormMoveList = () => {
    setShowFormMoveList(false);
    setIsModalOptionsActive(true);
  }

  const closeAllMoveList = () => {
    setShowFormMoveList(false);
    setIsModalOptionsActive(false);
  }

  const callbackHandleMoveList = ({idBoard, list, position}: {idBoard: string, list: ListProps, position: number}) => {
    moveList({idBoard, list, position});
    // setIsModalOptionsActive(true);
    setShowFormMoveList(false);
  }
    
  return { showFormMoveList, openFormMoveList, closeFormMoveList, closeAllMoveList, callbackHandleMoveList }
}