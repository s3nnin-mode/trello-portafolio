import { useAuthContext } from "../customHooks/useAuthContext";
import { useBoardsStoree } from "../store/boardsStore";
import { BoardProps } from "../types/boardProps";

export const useBoardsServices = () => {
  const { userAuth } = useAuthContext();

  const boardsService = ({updateFn}: 
    {
      updateFn: (BoardsGroup: BoardProps[]) => BoardProps[]
    }) => {
    
      useBoardsStoree.setState((state) => ({
        boards: updateFn(state.boards)
      }));

      if (userAuth) {

      } else {
        const boardsLS = localStorage.getItem('boards-storage');
        if (boardsLS) {
          const boardsGroup = JSON.parse(boardsLS) as BoardProps[];
          const boards = updateFn(boardsGroup);
          localStorage.setItem('boards-storage', JSON.stringify(boards));
        }
      }
    }

    return { boardsService }
}