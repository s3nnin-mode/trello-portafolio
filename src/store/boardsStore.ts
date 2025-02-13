import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BoardProps } from "../types/boardProps";

interface State {
    boards: BoardProps[]
    setBoards: (boards: BoardProps[]) => void;
    setBoard: (board: BoardProps) => void;
}

export const useBoardsStoree = create<State>()(
    persist(
        (set) => ({
            boards: [],
            setBoards: (boards) => set(() => ({
                boards: boards
            })),
            setBoard: (board) => set((state) => ({
                boards: [...state.boards, board]
            }))
        }),
        {
            name: 'boards-storage'
        }
    ) 
)
