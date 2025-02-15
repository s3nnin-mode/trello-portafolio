import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BoardProps } from "../types/boardProps";

interface State {
    boards: BoardProps[]
    setBoards: (boards: BoardProps[]) => void;
    setBoard: (board: BoardProps) => void;
}

// import {userAuth } from 'ejemplo';  userAuth estara en un contexto o en un estado de zustand

export const useBoardsStoree = create<State>((set) => ({
    boards: [],
    setBoards: (boards) => set(() => {                                          //Cargamos los boards desde firebase o del localstorage
        return { boards: boards }
    }),
    setBoard: (board) => set((state) => ({  //al actualizar un tablero verificamos isDemo, de ser asi guardamos manualmente en localstorage para que esten coordinados. Sino no guardamos nada, ya que significa que es de firebase, la logica para actualizar en firebase sera directamente en el componente, solo actualizamos el estado para estar sincronizado
        boards: [...state.boards, board]
    }))
}));

//Todo lo de abajo sera un contexto de react que recargará los datos al store cada vez que userAuth cambia:


//     persist(
//         (set) => ({
//             boards: [],
//             setBoards: (boards) => set(() => {
//                 if (!userAuth) {
//                     localStorage.setItem('boards-storage', JSON.stringify(boards));
//                 }
//                 return { boards: boards }
//             }),
//             setBoard: (board) => set((state) => ({
//                 boards: [...state.boards, board]
//             }))
//         }),
//         {
//             name: 'boards-storage'
//         }
//     ) 
// )
