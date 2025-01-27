import '../../styles/tablero/tablero.scss';
import { List } from './lista';
import { BtnAdd } from './btnAgregar';
import { useEffect, useState } from "react";
import { Target } from "./tarjeta";
import { useParams } from 'react-router-dom';
import { useBoards } from '../rutas/tableros';
import { BoardProps } from '../../types/boardProps';

export const Tablero = () => {
    const [currentBoard, setCurrentBoard] = useState<BoardProps>();
    const [indexBoard, setIndexBoard] = useState(1000);

    const { boards, addNewList } = useBoards();
    const { board } = useParams();

    if (!board) {
        return <p>Tablero no encontrado</p>
    }

    useEffect(()=> {
        const index = boards.findIndex(b => b.nameBoard === board);
        if (index > -1) {
            console.log('si se halló el board', boards[index])
            setCurrentBoard(boards[index]);
            setIndexBoard(index);
            return
        }
        console.log('No se hallo el board', board, boards)

    }, [boards]);

    return (
        <div className='board' >
            <header>
                <h2>{currentBoard?.nameBoard}</h2>
            </header>
            <div className='board_content'>
                {
                    currentBoard !== undefined && (
                        currentBoard.lists.map((list, index) => {
                            
                            // <List nameList={list.listName} targets={list.targets} indexList={index} board={board} key={list.listName} />
                            return <List nameList={list.nameList} targets={list.targets} indexBoard={indexBoard} indexList={index} board={board} key={list.nameList} />
                        })
                    )
                }
                <BtnAdd 
                    createListOrTargetName={(nameList: string) => addNewList({nameList, board})} 
                    btnName='list' 
                    className='container_btn_add_list'
                />
            </div>
        </div>
    )
};