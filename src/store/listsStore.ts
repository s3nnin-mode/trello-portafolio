import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ListProps, ListsGroup } from "../types/boardProps";

interface State {
    listsGroup: ListsGroup[];
    setListGroup: (props: {idBoard: string}) => void
    setList: (props: {idBoard: string, newList: ListProps}) => void
    setColorList: (props: {idBoard: string, idList: string, color: string}) => void
    setNewNameList: (props: {idBoard: string, idList: string, newNameList: string}) => void
    deleteList: (props: {idBoard: string, idList: string}) => void
    setLists: (props: {idBoard: string, lists: ListProps[]}) => void
}

export const useListsStore = create<State>()(
    persist(
        (set) => ({
            listsGroup: [],
        setListGroup: ({idBoard}) => set((state) => ({
            listsGroup: [...state.listsGroup, {idBoard: idBoard, lists: []}]
        })),
        setList: ({idBoard, newList}) => set((state) => ({
            listsGroup: state.listsGroup.map((listGroup) => listGroup.idBoard === idBoard
            ?
            { ...listGroup, lists: [...listGroup.lists, newList]}
            :
            listGroup
        )})),
        setLists: ({idBoard, lists}) => set((state) => ({
            listsGroup: state.listsGroup.map((listGroup) => 
                listGroup.idBoard === idBoard
            ?
            { ...listGroup, lists: lists }
            :
            listGroup
            )
        })),
        setColorList: ({idBoard, idList, color}) => set((state) => ({
            listsGroup: state.listsGroup.map((listGroup) => 
            listGroup.idBoard === idBoard 
            ?
            { 
                ...listGroup,
                lists: listGroup.lists.map((list) => 
                list.idList === idList ? { ...list, colorList: color } : list
                )
            }
            :
            listGroup
            )
        })),
        setNewNameList: ({idBoard, idList, newNameList}) => set((state) => ({
            listsGroup: state.listsGroup.map((listGroup) => 
            listGroup.idBoard === idBoard
            ?
            {
                ...listGroup,
                lists: listGroup.lists.map((list) => 
                    list.idList === idList ? { ...list, nameList: newNameList } : list
                )
            }
            :
            listGroup
        )
        })),
        deleteList: ({idBoard, idList}) => set((state) => ({
            listsGroup: state.listsGroup.map((listGroup) => 
            listGroup.idBoard === idBoard
            ?
            {...listGroup, lists: listGroup.lists.filter(list => list.idList !== idList)}
            :
            listGroup
            )
        }))
    }),
    {
        name: 'lists-storage'
    }
    )
)