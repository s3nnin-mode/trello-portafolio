import '../../styles/tablero/tablero.scss';
import { List } from './lista';
import { BtnAdd } from './btnAgregar';
import { useCallback, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { BoardProps } from '../../types/boardProps';
import { useBoardsStore } from '../../store/boardsStore';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';


const useCustomBoard = () => {
    const { boards, setList, setLists } = useBoardsStore();

    const addNewList = ({nameList, idBoard}: {nameList: string, idBoard: string}) => {
        const newList = { 
            idList: (nameList + Date.now()).toString(), 
            nameList: nameList, 
            colorList: 'brown', 
            targets: []
        }

        setList({idBoard, newList});
    }

    return { addNewList, setLists, boards }
}

export const Tablero = () => {
    const [currentBoard, setCurrentBoard] = useState<BoardProps>();
    const [idBoard, setIdBoard] = useState('');
    const { boards, addNewList, setLists } = useCustomBoard();
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
        console.log('No se hallo el board', currentBoard?.idBoard, boards);

    }, [boards]);

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!currentBoard || !over) return;

        const oldIndex = currentBoard?.lists.findIndex(list => list.idList === active.id);
        const newIndex = currentBoard?.lists.findIndex(list => list.idList === over?.id);

        // if (!currentBoard || oldIndex === undefined || newIndex === undefined) {
        //     return
        // }

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
            console.log('Se canceló el drag (no hay cambios en la posición)');
            return;
        }

        const lists = arrayMove(currentBoard.lists, oldIndex, newIndex);

        setLists({idBoard, lists});
    };

    

    return (
        <div className='board' >
            <header>
                <h2>{currentBoard?.nameBoard}</h2>                                      {/* NAME BOARD */}
            </header>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                {
                    currentBoard?.lists !== undefined && (
                        <SortableContext items={currentBoard?.lists.map((list) => list.idList)} strategy={verticalListSortingStrategy}>
                            <div className='board_content'>
                                {
                                currentBoard.lists.map((list, index) => {
                                    return <List idBoard={idBoard} list={list} key={list.idList} />
                                })
                                }

                                <BtnAdd 
                                    createListOrTargetName={(nameList: string) => addNewList({nameList, idBoard})} 
                                    btnName='list' 
                                    className='container_btn_add_list'
                                />
                            </div>
                        </SortableContext>
                    )
                }
            </DndContext>
        </div>
    )
};