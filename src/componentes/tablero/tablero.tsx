import '../../styles/tablero/tablero.scss';
//HOOKS
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
//COMPONENTS
import { List } from './lista';
import { BtnAdd } from './btnAgregar';
//DND-KIT
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

//STORES
import { useListsStore } from '../../store/listsStore';
import { useBoardsStoree } from '../../store/boardsStoredos';
import { useTargetsStore } from '../../store/targetsStore';
//TYPES
import { BoardProps, ListProps, TargetProps } from '../../types/boardProps';

const useCustomBoard = () => {
    const { setList, setLists, listsGroup } = useListsStore();
    const { setTargetsGroup } = useTargetsStore();
    const { boards } = useBoardsStoree();

    const addNewList = ({value, idBoard}: {value: string, idBoard: string}) => {
        const nameList = value;
        const idList = (nameList + Date.now()).toString();
        const newList = { 
            idList: idList, 
            nameList: nameList, 
            colorList: 'brown', 
            targets: []
        }
        setList({idBoard, newList});
        const targets: TargetProps[] = [];
        setTargetsGroup({idBoard, idList, targets});  //crear obejeto con propieda idBoard y idList para saber que pertenece a este ->tablero->lista. Se incializa con un array vacío
    }

    return { addNewList, setLists, boards, listsGroup }
}

export const Tablero = () => {
    const { boards, listsGroup, addNewList, setLists } = useCustomBoard();

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
            console.log('si se halló el board', boards[indexBoard])
           
            setCurrentBoard(boards[indexBoard]);
            setIdBoard(boards[indexBoard].idBoard);
            return
        }
        console.log('No se hallo el board', currentBoard?.idBoard, boards);

    }, [boards]);

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

        setLists({idBoard, lists});
    };

    

    return (
        <div className='board' >
            <header>
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