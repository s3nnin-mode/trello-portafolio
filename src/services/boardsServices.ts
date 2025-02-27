import { useAuthContext } from "../customHooks/useAuthContext";
import { useBoardsStore } from "../store/boardsStore";
import { BoardProps } from "../types/boardProps";

export const useBoardsServices = () => {
  const { userAuth } = useAuthContext();

  const boardsService = ({updateFn}: 
    {
      updateFn: (BoardsGroup: BoardProps[]) => BoardProps[]
    }) => {
    
      useBoardsStore.setState((state) => ({
        boards: updateFn(state.boards)
      }));

      if (!userAuth) {
        const boardsLS = localStorage.getItem('boards-storage');
        if (boardsLS) {
          const boardsGroup = JSON.parse(boardsLS) as BoardProps[];
          const boards = updateFn(boardsGroup);
          localStorage.setItem('boards-storage', JSON.stringify(boards));
        }
      }

      // if (userAuth) {
      //   // console.log('user auth y board', userAuth, board);
      //   // addBoard(board);
      //   // console.log('se agrego el board: ', board);
      // } else {
      //   const boardsLS = localStorage.getItem('boards-storage');
      //   if (boardsLS) {
      //     const boardsGroup = JSON.parse(boardsLS) as BoardProps[];
      //     const boards = updateFn(boardsGroup);
      //     localStorage.setItem('boards-storage', JSON.stringify(boards));
      //   }
      // }
    }

    return { boardsService }
}