import { create } from 'zustand';
import { BoardProps, ListProps, TargetProps } from '../types/boardProps';
import { List } from '../componentes/tablero/lista';
import { persist } from 'zustand/middleware';

interface State {
  boards: BoardProps[]
  setBoards: (boards: BoardProps[]) => void
  setBoard: (newBoard: BoardProps) => void;
  setList: (props: {idBoard: string, newList: ListProps}) => void
  setNewNameList: (props: {idBoard: string, idList: string, newNameList: string}) => void;
  deleteList: (props: {idBoard: string, idList: string}) => void
  setLists: (props: {idBoard: string, lists: ListProps[]}) => void
  setTarget: (props: {idBoard: string, idList: string, newTarget: TargetProps}) => void
  setColorList: (props: {idBoard: string, idList: string, color: string}) => void
}

export const useBoardsStore = create<State>()(
  persist(
    (set) => ({
      boards: [],
      setBoards: (boards) => set((state) => {
        return { boards: boards }
      }),
      setBoard: (newBoard) => set((state) => ({
        boards: [...state.boards, newBoard]
      })),
      setNewNameList: ({idBoard, idList, newNameList}) => set((state) => ({
        boards: state.boards.map((board) => 
          idBoard === board.idBoard 
        ?
          {
            ...board,
            lists: board.lists.map((list) =>
            idList === list.idList
            ?
            {
              ...list,
              nameList: newNameList
            }
            :
            list
            )
          }
        :
        board
        )
      }))
      ,
      setLists: ({idBoard, lists}) => set((state) => ({
        boards: state.boards.map((board) => board.idBoard === idBoard ? { ...board, lists: lists } : board)
      }))
      ,
      setList: ({idBoard, newList}) => set((state) => ({
        boards: state.boards.map((board) => 
          idBoard === board.idBoard 
          ?
          { ...board, lists: [...board.lists, newList] }
          :
          board
        )
      })),
      setColorList: ({idBoard, idList, color}) => set((state) => ({
        boards: state.boards.map((board) =>
        idBoard === board.idBoard
        ?
        {
          ...board,
          lists: board.lists.map((list) => idList === list.idList ? { ...list, colorList: color } : list
          )
        }
        :
        board
      )
      })),
      deleteList: ({idBoard, idList}) => set((state) => ({
        boards: state.boards.map((board) =>
        idBoard === board.idBoard
        ?
          {
            ...board,
            lists: board.lists.filter(list => list.idList !== idList)
          }
        :
          board
        )
      })),
      setTarget: ({idBoard, idList, newTarget}) => set((state) => ({
        boards: state.boards.map((board) => 
          idBoard === board.idBoard
          ?
            {
              ...board,
              lists: board.lists.map((list) => 
                idList === list.idList
                ?
                  { ...list, targets: [...list.targets, newTarget] }
                :
                 list
              )
            }
          :
            board
        )
      }))
    }),
    {
      name: 'boards-storageNull'
    }
  )
)
