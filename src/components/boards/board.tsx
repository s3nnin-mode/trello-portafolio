import '../../styles/components/boards/board.scss';
//HOOKS
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
//COMPONENTS
import { List } from '../list/list';
import { Card } from '../card/card';
import { BtnAdd } from '../reusables/btnAgregar';
//DND-KIT
import {  DragOverlay, DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

//STORES
import { useListsStore } from '../../store/listsStore';
import { useBoardsStore } from '../../store/boardsStore';
//TYPES
import { BoardProps, CardProps, ListProps } from '../../types/boardProps';
import { useListsServices } from '../../services/listsServices';
import { useCardsServices } from '../../services/cardsServices';
import { useCardsStore } from '../../store/cardsStore';

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

    const [activeList, setActiveList] = useState<ListProps | null>(null); //esto es para saber que lista esta siendo arrastrada y crear un efecto visual
    const [activeCard, setActiveCard] = useState<CardProps | null>(null);

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
    }, [listsGroup]);

    const onDragEnd = (event: DragEndEvent) => {
      setActiveCard(null);
      setActiveList(null);
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

  const sensors = useSensors(
    useSensor(PointerSensor, {  //esto es para que el drag empiece cuando el mouse este a 15px de distancia, en otras palabras
      activationConstraint: {
          distance: 5
      }
    })
  );

  const [listToActiveCard, setListToActiveCard] = useState<ListProps | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    setActiveList(null);
    setActiveCard(null);
    if (event.active.data.current?.type === 'list') {
      setActiveList(event.active.data.current.list);
      return;
    }

    if (event.active.data.current?.type === 'card') {
      setActiveCard(event.active.data.current.card);
      const cardGroup = cardsGroup.findIndex((cardGroup) => cardGroup.cards.some((card) => card.idCard === event.active.data.current?.card.idCard));
      if (cardGroup === -1) return;
      const idList = cardsGroup[cardGroup].idList;
      const list = listsGroup.find((listGroup) => listGroup.lists.some((list) => list.idList === idList))?.lists.find((list) => list.idList === idList);
      if (list) {
        setListToActiveCard(list);
      }
    }
  }

  const { cardsServices } = useCardsServices();
  const { cardsGroup } = useCardsStore()

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === 'card';
    const isOverCard = over.data.current?.type === 'card';

    if (isActiveCard && isOverCard) {
      //primero hay que encontrar la lista a la que pertenece la card
      const idList = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId))?.idList;
      const cardGroupIndex = cardsGroup.findIndex((cardGroup) => cardGroup.idBoard === idBoard && cardGroup.idList === idList);
      if (cardGroupIndex === -1) return;

      const oldIndex = cardsGroup[cardGroupIndex].cards.findIndex((card) => card.idCard === activeId);
      const newIndex = cardsGroup[cardGroupIndex].cards.findIndex((card) => card.idCard === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const newCards = arrayMove(cardsGroup[cardGroupIndex].cards, oldIndex, newIndex);  
      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === idList) {
            return { ...cardGroup, cards: newCards };
          }
          return cardGroup;
        })
      })
    }

    const isOverList = over.data.current?.type === 'list';

    if (isActiveCard && isOverList) {
      const idList = overId;
        
      const grupoDondeSeEncuentraLaCard = cardsGroup.findIndex((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId));
      if (grupoDondeSeEncuentraLaCard === -1) return;

      const cardToMove = cardsGroup[grupoDondeSeEncuentraLaCard].cards.find((card) => card.idCard === activeId);
      if (!cardToMove) return;

      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === cardsGroup[grupoDondeSeEncuentraLaCard].idList) {
            return { ...cardGroup, cards:  cardGroup.cards.filter((card) => card.idCard !== activeId) };
          }
          return cardGroup;
        })
      });

      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === idList) {
            return { ...cardGroup, cards: [...cardGroup.cards, cardToMove] };
          }
          return cardGroup;
        })
      });
    }
  }

  return (
    <div className='board' >
      <header className='header_board'>
        <h2>{currentBoard?.nameBoard}</h2>                                      {/* NAME BOARD */}
      </header>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className='board_content'>
        {
        currentLists !== undefined && (
          <SortableContext items={currentLists.map((list) => list.idList)}> {/*strategy={verticalListSortingStrategy}*/}
            {
              currentBoard && (               //antes de pasar board verifico que exista
                currentLists.map((list) => {
                  return <List board={currentBoard} list={list} key={list.idList} />
                })
              )
            }
          </SortableContext>
        )
        }

        <DragOverlay>
          { activeList && currentBoard && <List board={currentBoard} list={activeList} />}
          { activeCard && currentBoard && listToActiveCard && <Card board={currentBoard} list={listToActiveCard} card={activeCard} /> }
        </DragOverlay>

        <BtnAdd
            className='form_add_list'
            createListOrTargetName={(value: string) => addNewList({value, idBoard})}
            nameComponentToAdd='list'
        />
        </div>
      </DndContext>
    </div>
  )
};