import { create } from "zustand";
import { ListProps, ListsGroup } from "../types/boardProps";

interface State {
    listsGroup: ListsGroup[];
    loadLists: (lists: ListsGroup[]) => void      //para cargar datos de firebase o ls
    setListGroup: (props: {idBoard: string}) => void
    setList: ({idBoard, newList}: {idBoard: string, newList: ListProps}) => void
    setColorList: (props: {idBoard: string, idList: string, color: string}) => void
    setNewNameList: (props: {idBoard: string, idList: string, newNameList: string}) => void
    deleteList: (props: {idBoard: string, idList: string}) => void
    setLists: (props: {idBoard: string, lists: ListProps[]}) => void
}

//ya no ocupas las actions, solo necesitas replicar esta logica en cada componente que lo use
export const useListsStore = create<State>((set) => ({
        listsGroup: [],
        loadLists: (lists) => set(() => ({
            listsGroup: lists
        })),
        setListGroup: ({idBoard}) => set((state) => ({            //por cada tablero creado se inicializa un grupo de listas que pertenecen a ese tablero. Se inicializa con un []
            listsGroup: [...state.listsGroup, {idBoard: idBoard, lists: []}]
        })),
        setList: ({idBoard, newList}) => set((state) => ({             //cuando se agrega una lista se busca el grupo de lista al que pertenece
            listsGroup: state.listsGroup.map((listGroup) => listGroup.idBoard === idBoard
            ?
            { ...listGroup, lists: [...listGroup.lists, newList]}
            :
            listGroup
        )})),
        setLists: ({idBoard, lists}) => set((state) => ({           //creo que era para dar actualizar el orden de las listas de un grupo
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
}));


        // {
        //     name: 'lists-storage'
        // }