import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { BoardProps } from "../types/boardProps";

interface BoardContextType {
    boards: BoardProps[] | []
    setBoards: React.Dispatch<React.SetStateAction<BoardProps[] | []>>
    addNewList: (props: {nameList: string, board: string}) => void
}

export const BoardsContext = createContext<BoardContextType | undefined>(undefined);

export const BoardsData: React.FC<PropsWithChildren<{}>> = ({children}) => {
    const [boards, setBoards] = useState<BoardProps[]>([]);

    const addNewList = ({nameList, board}: {nameList: string, board: string}) => {
        const index = boards.findIndex(b => b.nameBoard === board);

        if (index > -1) {
            const BOARDS = [...boards];
            BOARDS[index].lists = [...BOARDS[index].lists, {nameList: nameList, targets: []}]
            
            localStorage.setItem('boards', JSON.stringify(BOARDS));
            setBoards(BOARDS);
            console.log(`Se agregó la lista ${nameList} en el board ${board} correctamente`);
            return
        }
        console.log(`No se pudo agregar la lista ${nameList} porque no se encontró el board ${board}`);
    }

    useEffect(() => {
        const dataLS = localStorage.getItem('boards');

        if (dataLS) {
            setBoards(JSON.parse(dataLS));
        } else {
            setBoards([]);
            localStorage.setItem('boards', JSON.stringify([]))
        }

    }, []);

    return (
        <BoardsContext.Provider value={{boards, setBoards, addNewList}}>
            {children}
        </BoardsContext.Provider>
    )
}