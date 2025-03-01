import { useState } from "react";
import { useListsStore } from "../../store/listsStore";
import { ListProps } from "../../types/boardProps";
import { useListsServices } from "../../services/listsServices";
import { updateOrderListsFirebase, updtateOrderList } from "../../services/firebase/updateData/updateLists";

interface UseFormMoveList {
    setIsModalOptionsActive: React.Dispatch<React.SetStateAction<boolean>>
    // setShowFormMoveList: React.Dispatch<React.SetStateAction<boolean>>
}

export const useFormMoveList = ({ setIsModalOptionsActive}: UseFormMoveList) => {
    const { listsGroup } = useListsStore();
    const { listsService } = useListsServices();
    const [showFormMoveList, setShowFormMoveList] = useState(false)

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
                    updtateOrderList({idBoard, list: listUpdate});
                    return listUpdate
                }
            }
            return l
        });
        console.log('lists', lists)

        if (lists.some(list => list.order < 0)) {
            let newOrder = 0;

            lists = lists.map((list) => {
                const listUpdate = {...list, order: newOrder};
                newOrder = newOrder + 10;
                return listUpdate;
            });
            updateOrderListsFirebase({idBoard, updateLists: lists});
            console.log('se actualizo order de listas: ', lists);
        }

        listsService({
            updateFn: (listsGroup) => listsGroup.map((listGroup) =>
                listGroup.idBoard === idBoard
                ?
                { ...listGroup, lists: lists }
                :
                listGroup
            )
        })
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