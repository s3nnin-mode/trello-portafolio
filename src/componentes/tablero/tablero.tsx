import '../../styles/tablero/tablero.scss';
import { List } from './lista';
import { BtnAdd } from './btnAgregar';
import { useEffect, useState } from "react";
import { Target } from "./tarjeta";
import { useParams } from 'react-router-dom';
import { BoardProps } from '../../types/boardProps';
import { useBoardsStore } from '../../store/boardsStore';

const useCustomBoard = () => {
    const { boards, setList } = useBoardsStore();

    const addNewList = ({nameList, idBoard}: {nameList: string, idBoard: string}) => {
        const newList = { 
            idList: (nameList + Date.now()).toString(), 
            nameList: nameList, 
            colorList: 'brown', 
            targets: []
        }
        setList({idBoard, newList});
    }

    return { addNewList, boards }
}

export const Tablero = () => {
    const [currentBoard, setCurrentBoard] = useState<BoardProps>();
    const [idBoard, setIdBoard] = useState('');

    const { boards, addNewList } = useCustomBoard();
    const { currentIdBoard } = useParams();

    if (!currentIdBoard) {
        return <p>Tablero no encontrado</p>
    }

    useEffect(()=> {
        const indexBoard = boards.findIndex(b => b.idBoard === currentIdBoard);
        if (indexBoard > -1) {
            console.log('si se halló el board', boards[indexBoard])
            setCurrentBoard(boards[indexBoard]);
            setIdBoard(boards[indexBoard].idBoard);
            return
        }
        console.log('No se hallo el board', idBoard, boards)

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
                            return <List idBoard={idBoard} idList={list.idList} key={list.idList} />
                        })
                    )
                }

                <BtnAdd 
                    createListOrTargetName={(nameList: string) => addNewList({nameList, idBoard})} 
                    btnName='list' 
                    className='container_btn_add_list'
                />
            </div>
        </div>
    )
};