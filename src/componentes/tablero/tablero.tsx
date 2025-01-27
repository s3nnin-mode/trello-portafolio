import '../../styles/tablero/tablero.scss';
import { List } from './lista';
import { BtnAdd } from './btnAgregar';
import { useEffect, useState } from "react";
import { Target } from "./tarjeta";
import { useParams } from 'react-router-dom';
import { useBoards } from '../rutas/tableros';
import { BoardProps } from '../../types/boardProps';

interface ListaProps {
    name: string
}

interface TableroProps {
    nameBoard: string
}

interface ListProps {
    listName: string,
    targets: { 
        nameTarget: string, 
        nameList: string,  
        tags: { color: string, active: boolean, nameTag: string }[]
    }[]
}

export const Tablero = () => {
    const [currentBoard, setCurrentBoard] = useState<BoardProps>();

    const { boards, addNewList } = useBoards();
    const { board } = useParams();

    if (!board) {
        return <p>Tablero no encontrado</p>
    }

    useEffect(()=> {
        const index = boards.findIndex(b => b.name === board);
        if (index > -1) {
            console.log('si se halló el board', boards[index])
            setCurrentBoard(boards[index]);
            return
        }
        console.log('No se hallo el board', board, boards)

    }, [boards]);

    return (
        <div className='board' >
            <header>
                <h2>{currentBoard?.name}</h2>
            </header>
            <div className='board_content'>
                {
                    currentBoard !== undefined && (
                        currentBoard.lists.map((list) => (
                            <List nameList={list.listName} key={list.listName} />
                        ))
                    )
                }
                <BtnAdd createListOrTargetName={(nameList: string) => addNewList({nameList, board})} btnName='list'/>
            </div>
        </div>
    )
};