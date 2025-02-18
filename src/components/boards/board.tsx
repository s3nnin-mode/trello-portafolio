import '../../styles/components/boards/board.scss';
//HOOKS
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
//COMPONENTS
import { List } from '../list/list';
import { BtnAdd } from '../reusables/btnAgregar';
//DND-KIT
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

//STORES
import { useListsStore } from '../../store/listsStore';
import { useBoardsStore } from '../../store/boardsStore';
//TYPES
import { BoardProps, ListProps } from '../../types/boardProps';
import { useListsServices } from '../../services/listsServices';
import { useCardsServices } from '../../services/cardsServices';

const useCustomBoard = () => {
    const { listsGroup } = useListsStore();
    const { boards } = useBoardsStore();
    const { listsService } = useListsServices();
    const { createCardGroup } = useCardsServices();

    const addNewList = ({value, idBoard}: {value: string, idBoard: string}) => {
        const nameList = value;
        const idList = (nameList + Date.now()).toString();

        const newList: ListProps = { 
            idList: idList, 
            nameList: nameList, 
            colorList: 'brown', 
        }
        
        listsService({
            updateFn: (listsGroup) => listsGroup.map((listGroup) => 
                listGroup.idBoard === idBoard ?
                {...listGroup, lists: [...listGroup.lists, newList]} :
                listGroup
            )
        });
        createCardGroup({idBoard, idList, cards: []});
        //se inializa las cards con [] y un idBoard e idList
        //para saber que estas cartas pertenece a este tablero y a esta lista
    }

    return { addNewList, boards, listsGroup }
}

export const Tablero = () => {
    const { listsService } = useListsServices();
    const { boards, listsGroup, addNewList } = useCustomBoard();
    const [currentBoard, setCurrentBoard] = useState<BoardProps>();
    const [idBoard, setIdBoard] = useState('');

    const [currentLists, setCurrentLists] = useState<ListProps[]>()
    const { currentIdBoard } = useParams();

    if (!currentIdBoard) {
        return <p>Tablero no encontrado</p>
    }

    useEffect(()=> {
        const indexBoard = boards.findIndex(b => b.idBoard === currentIdBoard);
        if (indexBoard > -1) {
            setCurrentBoard(boards[indexBoard]);
            setIdBoard(boards[indexBoard].idBoard);
            return
        }
    }, [boards, currentIdBoard]);

    useEffect(() => {
        const indexListGroup = listsGroup.findIndex((listGroup) => listGroup.idBoard === currentIdBoard);
        if (indexListGroup > -1) {
            setCurrentLists(listsGroup[indexListGroup].lists);
        }
        console.log('se re-renderizó lists')
    }, [listsGroup]);

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!currentLists || !over) return

        const oldIndex = currentLists.findIndex(list => list.idList === active.id);
        const newIndex = currentLists.findIndex(list => list.idList === over?.id);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
            console.log('Se canceló el drag (no hay cambios en la posición)');
            return;
        }

        const lists = arrayMove(currentLists, oldIndex, newIndex);
        listsService({
            updateFn: (listsGroup) => listsGroup.map((listGroup) => 
            listGroup.idBoard === idBoard
            ?
            { ...listGroup, lists: lists }
            :
            listGroup
            )
        })
    };

    // if (!currentIdBoard || currentBoard?.idBoard) {
    //     return <p>Tablero no encontrado</p>
    // }

    return (
        <div className='board' >
            <header className='header_board'>
                <h2>{currentBoard?.nameBoard}</h2>                                      {/* NAME BOARD */}
            </header>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                {
                    currentLists !== undefined && (
                        <SortableContext items={currentLists.map((list) => list.idList)} strategy={verticalListSortingStrategy}>
                            <div className='board_content'>
                                {
                                    currentBoard && (               //antes de pasar board verifico que exista
                                        currentLists.map((list) => {
                                            return <List board={currentBoard} list={list} key={list.idList} />
                                        })
                                    )
                                }

                                <BtnAdd 
                                    className='form_add_list'
                                    createListOrTargetName={(value: string) => addNewList({value, idBoard})} 
                                    nameComponentToAdd='list' 
                                />
                            </div>
                        </SortableContext>
                    )
                }
            </DndContext>
        </div>
    )
};