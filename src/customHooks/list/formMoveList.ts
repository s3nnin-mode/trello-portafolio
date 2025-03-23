import { useState } from "react";
import { useListsStore } from "../../store/listsStore";
import { ListProps } from "../../types/boardProps";
import { useListsServices } from "../../services/listsServices";
import { updateOrderListsFirebase, updtateOrderList } from "../../services/firebase/updateData/updateLists";
import { useAuthContext } from "../useAuthContext";

interface UseFormMoveList {
    setIsModalOptionsActive: React.Dispatch<React.SetStateAction<boolean>>
    // setShowFormMoveList: React.Dispatch<React.SetStateAction<boolean>>
}

export const useFormMoveList = ({ setIsModalOptionsActive}: UseFormMoveList) => {
    const { listsGroup } = useListsStore();
    const { listsService } = useListsServices();
    const [showFormMoveList, setShowFormMoveList] = useState(false);
    const { userAuth } = useAuthContext();

    const moveList = ({idBoard, list, position}: {idBoard: string, list: ListProps, position: number}) => {
        const indexListGroup = listsGroup.findIndex(listGroup => listGroup.idBoard === idBoard);

        let INDEX: number;
        let LIST: ListProps;

        for (let i = 0; i < listsGroup[indexListGroup].lists.length; i++) {
            if (listsGroup[indexListGroup].lists[i].idList === list.idList) {
                INDEX = i
            }

            if (i === position) {
                LIST = listsGroup[indexListGroup].lists[i];
            }
        }

        let lists = listsGroup[indexListGroup].lists.map((l, index) => {
            if (index === position) {
                return list
            }

            if (index === INDEX) {
                return LIST
            }

            return l
        });

        //este mapeo es para calcular el valor de la card movida
        lists = lists.map((l, index) => {
            if (l === list) {
                const prevList = lists[index - 1];
                const postList = lists[index + 1];
                if (prevList && postList) {
                    const listUpdate = {...l, order: (prevList.order + postList.order) / 2}
                    updtateOrderList({idBoard, list: listUpdate});
                    return listUpdate
                } else if (prevList) {
                    const listUpdate = {...l, order: prevList.order + 10};
                    updtateOrderList({idBoard, list: listUpdate});
                    return listUpdate
                } else if (postList) { //ocupas un for para resetear todo aqui
                    console.log('solo hay postList')
                    const listUpdate = {...l, order: postList.order - 10};
                    // if (userAuth) {
                    //     updtateOrderList({idBoard, list: listUpdate});
                    // } 
                    return listUpdate
                }
            }
            return l
        });
        
        //Una vez calculado el nuevo order se verifica si no hay duplicados en las cards y valores negativos,
        //de lo contrario se revalua el order de cada card
        const hasDuplicates = lists.some((list, index, arr) => 
            arr.some((otherList, otherIndex) => otherIndex !== index && otherList.order === list.order)
        );
        
        const hasNegativeOrders = lists.some(list => list.order < 0);
        
        if (hasDuplicates || hasNegativeOrders) {
            lists = lists
                .sort((a, b) => a.order - b.order) // Asegurar orden ascendente
                .map((list, index) => ({ ...list, order: index * 10 })); // Reasignar desde 0
        }
        
        if (userAuth) {
            console.log('se reordeno en firebase')
            updateOrderListsFirebase({ idBoard, updateLists: lists }); //se reordena en firebase
        } else {

            listsService({
                updateFn: (listsGroup) => listsGroup.map((listGroup) =>
                    listGroup.idBoard === idBoard
                    ?
                    { ...listGroup, lists: lists }
                    :
                    listGroup
                )
            });
            console.log('se reordeno en local', lists);
        }
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
        setIsModalOptionsActive(true);
        setShowFormMoveList(false);
    }
    
    return { showFormMoveList, openFormMoveList, closeFormMoveList, closeAllMoveList, callbackHandleMoveList }
}