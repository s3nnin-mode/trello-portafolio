import { useState } from "react";
import { useListsStore } from "../../store/listsStore";
import { ListProps } from "../../types/boardProps";
import { useListsServices } from "../../services/listsServices";

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

        const lists = listsGroup[indexListGroup].lists.map((l, index) => {
            if (index === position) {
                return list
            }

            if (index === INDEX) {
                return LIST
            }

            return l
        })

        // setLists({idBoard, lists});
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