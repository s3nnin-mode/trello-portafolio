import { useAuthContext } from "../customHooks/useAuthContext";
import { useListsStore } from "../store/listsStore";
import { ListsGroup } from "../types/boardProps";

export const useListsServices = () => {
  const { userAuth } = useAuthContext();

  const listsService = ({updateFn}:
    {
      updateFn: (state: ListsGroup[]) => ListsGroup[], 
    }) => {

    useListsStore.setState((state) => ({
      listsGroup: updateFn(state.listsGroup)
    }));
  
    if (userAuth) {
      
    } else {
      const listsLS = localStorage.getItem('lists-storage');
  
      if (listsLS) {
        const listsGroup = JSON.parse(listsLS) as ListsGroup[];
        const lists = updateFn(listsGroup);
        localStorage.setItem('lists-storage', JSON.stringify(lists))
      }
    }
  }

  const createGroupList = ({idBoard}:{idBoard: string}) => {
    useListsStore.setState((state) => ({
      listsGroup: [...state.listsGroup, {idBoard, lists: []}]
    }));

    if (userAuth) {

    } else {
      const listsGroup = localStorage.getItem('lists-storage');
      if (listsGroup) {
        localStorage.setItem('lists-storage', JSON.stringify(
          [...JSON.parse(listsGroup), {idBoard, lists: []}]       //se inicializa un listas con []
        ));
      }
    }
  } 

  return { listsService, createGroupList }
}