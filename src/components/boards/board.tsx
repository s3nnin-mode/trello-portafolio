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
import { useAuthContext } from '../../customHooks/useAuthContext';
import { addListFirebase, updateOrderListsFirebase, updtateOrderList } from '../../services/firebase/updateData/updateLists';
import { moveCardThoAnotherList, updateOrderCard } from '../../services/firebase/updateData/updateCards';

const useCustomBoard = () => {
  const { listsGroup } = useListsStore();
  const { boards } = useBoardsStore();
  const { listsService } = useListsServices();
  const { createCardGroup } = useCardsServices();
  const { userAuth } = useAuthContext();

  const addNewList = ({value, idBoard}: {value: string, idBoard: string}) => {
    const nameList = value;
    const idList = (nameList + Date.now()).toString();


    const listGroup = listsGroup.find(listGroup => listGroup.idBoard === idBoard)?.lists;
    if (!listGroup) return
    const lastList = listGroup[listGroup.length - 1];

    const newList: ListProps = {
      idList: idList,
      nameList: nameList,
      colorList: '#1E1E1E',
      order: lastList ? lastList.order + 10 : 0
    }
    
    if (userAuth) {
      addListFirebase({idBoard, list: newList});
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
    const { userAuth } = useAuthContext();

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

    let lists = arrayMove(currentLists, oldIndex, newIndex);
    const prevList = lists[newIndex - 1];
    const postList = lists[newIndex + 1];
    let newOrder: number | undefined;

    if (prevList && postList) {
      newOrder = (prevList.order + postList.order) / 2;
      console.log('cayó en medio')
    } else if (prevList) {
      newOrder = prevList.order + 10;
      console.log('cayó al final')
    } else if (postList) { //aqui falta optimizar para no tener valores negativos en el order de alguna lista
      newOrder = postList.order - 10;
      console.log('cayó al principió');
    }

    if (userAuth && newOrder) {
      lists = lists.map((list, index) => 
        index === newIndex ?
        {...list, order: newOrder} :
        list
      )
      updtateOrderList({idBoard, list: lists[newIndex]});
      // updateOrderListsFirebase({idBoard, updateLists: lists});
    }

    const hasDuplicates = lists.some((list, index, arr) => 
      arr.some((otherList, otherIndex) => otherIndex !== index && otherList.order === list.order)
    );
  
    const hasNegativeOrders = lists.some(list => list.order < 0);
    
    if (hasDuplicates || hasNegativeOrders) {
      lists = lists
        .sort((a, b) => a.order - b.order) // Asegurar orden ascendente
        .map((list, index) => ({ ...list, order: index * 10 })); // Reasignar desde 0

      updateOrderListsFirebase({ idBoard, updateLists: lists });
      console.log('Se reorganizaron los orders en drag and drop: ', lists);
    }

    listsService({
      updateFn: (listsGroup) => listsGroup.map((listGroup) => listGroup.idBoard === idBoard ? { ...listGroup, lists: lists } : listGroup)
    });
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
    };
  }

  const { cardsServices } = useCardsServices();
  const { cardsGroup } = useCardsStore();

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
      if(!idList) return;
      const cardGroupIndex = cardsGroup.findIndex((cardGroup) => cardGroup.idBoard === idBoard && cardGroup.idList === idList);
      if (cardGroupIndex === -1) return;

      const oldIndex = cardsGroup[cardGroupIndex].cards.findIndex((card) => card.idCard === activeId);
      const newIndex = cardsGroup[cardGroupIndex].cards.findIndex((card) => card.idCard === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      let newCards = arrayMove(cardsGroup[cardGroupIndex].cards, oldIndex, newIndex);
      
      newCards = newCards.map((card, index) => {
        if (index === newIndex) {
          const prevCard = newCards[index - 1]
          const postCard = newCards[index + 1]

          if (prevCard && postCard) {
            card = {...card, order: (prevCard.order + postCard.order) / 2}
          } else if (prevCard) {
            card = {...card, order: prevCard.order + 10}
          } else if (postCard) {
            card = {...card, order: postCard.order - 10}
          }

          if (userAuth) {
            updateOrderCard({idBoard, idList, card});
          }
        }
        return card
      });

      //falta logica para reordenar si empieza haber numeros negativos u orders duplicados

      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === idList) {
            return { ...cardGroup, cards: newCards };
          }
          return cardGroup;
        })
      });
    }

    //LOGICA PARA MOVER LA CARD A OTRA LISTA

    const isOverList = over.data.current?.type === 'list';

    if (isActiveCard && isOverList) {
      const idList = overId;
        
      const groupOrigenCard = cardsGroup.findIndex((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId));
      if (groupOrigenCard === -1) return;

      const cardToMove = cardsGroup[groupOrigenCard].cards.find((card) => card.idCard === activeId);
      if (!cardToMove) return;

      //Se elimina la card del cardGroup al que estaba
      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === cardsGroup[groupOrigenCard].idList) {
            return { ...cardGroup, cards:  cardGroup.cards.filter((card) => card.idCard !== activeId) };
          }
          return cardGroup;
        })
      });

      //Se agrega a la lista en donde se dejó caer
      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === idList) {
            return { ...cardGroup, cards: [...cardGroup.cards, cardToMove].map((card, index) => {
              card = {...card, order: index === 0 ? 0 : cardGroup.cards[index - 1].order + 10}
              return card;
            })};
          }
          return cardGroup;
        })
      });

      const cardsUpdate = useCardsStore.getState().cardsGroup.find(cardGroup => cardGroup.idList === idList)?.cards;
      if (!cardsUpdate) return;

      if (userAuth) {
        moveCardThoAnotherList({
          idBoard, 
          idListOrigen: cardsGroup[groupOrigenCard].idList, 
          idListDestiny: idList as string, 
          card: cardToMove,
          cardsUpdate
        });
      }
    }
  }

  return (
    <div className='board' >
      <header className='header_board'>
        <h2 className='inter_title¿'>{currentBoard?.nameBoard}</h2>                                      {/* NAME BOARD */}
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