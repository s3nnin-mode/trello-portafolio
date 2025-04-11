import '../../styles/components/boards/board.scss';
//HOOKS
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
//COMPONENTS
import { List } from '../list/list';
import { Card } from '../card/card';
import { BtnAdd } from '../reusables/btnAgregar';
//DND-KIT
import {  DragOverlay, DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors, closestCenter, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

//STORES
import { useListsStore } from '../../store/listsStore';
import { useBoardsStore } from '../../store/boardsStore';
//TYPES
import { BoardProps, CardGroupProps, CardProps, ListProps } from '../../types/boardProps';
import { useListsServices } from '../../services/listsServices';
import { useCardsServices } from '../../services/cardsServices';
import { useCardsStore } from '../../store/cardsStore';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { addListFirebase } from '../../services/firebase/updateData/updateLists';
import { moveCardThoAnotherList, updateOrderCard, updateOrderCards } from '../../services/firebase/updateData/updateCards';
import { useTagsService } from '../../services/tagsServices';

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
      colorList: '#252526',
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
  // const { listsService } = useListsServices();
  const { boards, listsGroup, addNewList } = useCustomBoard();
  const [currentBoard, setCurrentBoard] = useState<BoardProps>();
  const [idBoard, setIdBoard] = useState('');
  const { userAuth } = useAuthContext();
  const { tagsServices } = useTagsService();
  const { cardsServices } = useCardsServices();
  const { cardsGroup } = useCardsStore();

  const [currentLists, setCurrentLists] = useState<ListProps[]>()
  const { currentIdBoard } = useParams(); //RUTA ACTUAL

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

  // const onDragEndd = (event: DragEndEvent) => { //Esta función está terminada solo para el drag&drop de las listas
  //   setActiveCard(null);
  //   setActiveList(null);
  //   const { active, over } = event;

  //   if (!currentLists || !over) return

  //   const oldIndex = currentLists.findIndex(list => list.idList === active.id);
  //   const newIndex = currentLists.findIndex(list => list.idList === over?.id);

  //   if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
  //     console.log('Se canceló el drag (no hay cambios en la posición)');
  //     return;
  //   }

  //   let lists = arrayMove(currentLists, oldIndex, newIndex);
    
  //   if (userAuth) {
  //     const prevList = lists[newIndex - 1];
  //     const postList = lists[newIndex + 1];
  //     let newOrder = 0;

  //     if (prevList && postList) {
  //       newOrder = (prevList.order + postList.order) / 2;
  //       console.log('cayó en medio');
  //     } else if (prevList) {
  //       newOrder = prevList.order + 10;
  //       console.log('cayó al final')
  //     } else if (postList) { //aqui falta optimizar para no tener valores negativos en el order de alguna lista
  //       newOrder = postList.order - 10;
  //       console.log('cayó al principió');
  //     } else {
  //       console.log('no cayó en ningún lado')
  //     }

  //     lists = lists.map((list, index) => {
  //       if (index === newIndex) {
  //         return {...list, order: newOrder}
  //       } 
  //       return list;
  //     });

  //     updtateOrderList({idBoard, list: lists[newIndex]});
  //     console.log('se actualizo el order de la lista movida');
  //     console.log('asi quedaron las listas', lists);

  //     const hasDuplicates = lists.some((list, index, arr) => 
  //       arr.some((otherList, otherIndex) => otherIndex !== index && otherList.order === list.order)
  //     );
    
  //     const hasNegativeOrders = lists.some(list => list.order < 0);
      
  //     if (hasDuplicates || hasNegativeOrders) {
  //       lists = lists
  //         .sort((a, b) => a.order - b.order) 
  //         .map((list, index) => ({ ...list, order: index * 10 }));
  
  //       updateOrderListsFirebase({ idBoard, updatedLists: lists });
  //       console.log('Se reorganizaron los orders en drag and drop: ', lists);
  //     }
  //   };

  //   listsService({
  //     updateFn: (listsGroup) => listsGroup.map((listGroup) => listGroup.idBoard === idBoard ? { ...listGroup, lists: lists } : listGroup)
  //   });
  // };

  const sensors = useSensors(
    useSensor(PointerSensor, {  //esto es para que el drag empiece cuando el mouse este a 15px de distancia, en otras palabras
      activationConstraint: {
        distance: 0.1
      }
    })
  );

  const [listToActiveCard, setListToActiveCard] = useState<ListProps | null>(null);
  const [origenGroup, setOrigenGroup] = useState<CardGroupProps | null>(null);
  // const [activeStart, setActiveStart] = useState(false);

  const onDragStart = (event: DragStartEvent) => {
    
    if (event.active.data.current?.type === 'list') {
      setActiveList(event.active.data.current.list);
      return;
    }
    
    if (event.active.data.current?.type === 'card') {
      if (activeCard === null) {
        setActiveCard(event.active.data.current.card);
      }

      if (origenGroup === null) {
        
        const cardGroup = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === event.active.data.current?.card.idCard));
        if (!cardGroup) return;
        setOrigenGroup(cardGroup);
        console.log('se dió un nuevo origenGroup', cardGroup);

        const idList = cardGroup.idList;
        const list = listsGroup.find((listGroup) => listGroup.lists.some((list) => list.idList === idList))?.lists.find((list) => list.idList === idList);
        if (!list) return;

        if (listToActiveCard === null) {
          setListToActiveCard(list);
        }
      }
    };
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      console.log('////////')
      console.log('activeID y overId son iguales en DragOver');
      console.log(activeId, overId)
      console.log('////////')
      // setActiveCard(null);
      // setOrigenGroup(null);
      // setActiveList(null);
      // setListToActiveCard(null);
      return;
    }

    const isActiveCard = active.data.current?.type === 'card';
    const isOverList = over.data.current?.type === 'list';

    if (overId === origenGroup?.idList) {
      console.log('se arrastró dentro de su propia lista')
    } else {
      console.log('se llevo la card fuera de la lista')
    }

   
    if (isActiveCard && isOverList && overId !== origenGroup?.idList) {
      const idList = overId;
        
      // const origenCardGroup = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId)); //esta variable es para sacar el idList y para obtener la card a mover
      if (!origenGroup) {
        console.log('no hay origenCardGroup DrageOver', origenGroup);
        return
      }
      
      // const cardToMove = origenGroup.cards.find((card) => card.idCard === activeId);
      const cardToMove = activeCard;
      if (!cardToMove) return;

      //Se elimina la card del cardGroup al que estaba
      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === origenGroup.idList) { //cardsGroup[groupOrigenCard].idList
            return { ...cardGroup, cards: cardGroup.cards.filter((card) => card.idCard !== cardToMove.idCard) };
          }
          return cardGroup;
        })
      });

      //se agrega al nuevo grupo
      cardsServices({
        updateFn: (cardGroup) => cardGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === idList) {
            const newCards = [...cardGroup.cards].some(card => card.idCard === cardToMove.idCard) ? [...cardGroup.cards] : [...cardGroup.cards, cardToMove]
            return { 
              ...cardGroup, 
              cards: newCards
              // return {...card, order: index === 0 ? 0 : cardGroup.cards[index - 1].order + 10} //no recuerdo porque se resetea el order
            };
          }
          return cardGroup;
        })
      });

      //Activar las etiquetas en las cards copiadas
      tagsServices((tags) => tags.map((tag) => {
        let tagToUpdate = tag.cardsThatUseIt.find(item => item.idCard === cardToMove.idCard);
        if (tagToUpdate) {
          return {
            ...tag, 
            cardsThatUseIt: [...tag.cardsThatUseIt, {...tagToUpdate, idList: overId as string}]
          }
        }
        return tag
      }));

      //Se agrega a la lista en donde se dejó caer    
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return
  
    const activeId = active.id;
    const overId = over.id;

    const idListDestiny = cardsGroup.find(cardGroup => cardGroup.cards.some(card => card.idCard === overId))?.idList; //overGroup es el grupo donde cayó la card

    if (activeId === overId && idListDestiny === origenGroup?.idList) {
      console.log('activeId y overId son iguales');
      console.log('activeId', activeId);
      console.log('overId', overId);
      setActiveCard(null);
      setOrigenGroup(null);
      setActiveList(null);
      setListToActiveCard(null);
      console.log('se dio null a todos los estados del drag')
      return;
    }
  
    const typeActive = active.data.current?.type;
    const typeOver = over.data.current?.type;
  
    if (typeActive === 'card' && typeOver === 'card') {
      console.log('si entra a condicional');

      const idList = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId))?.idList; //este idList de la lista en donde se dejó caer la card, no se usa la de origen group porque ese es el origen
      if (!idList) return;
  
      const cards = cardsGroup.find((group) => group.idBoard === idBoard && group.idList === idList)?.cards;

      if (!cards) {
        console.log('no se encontró cards');
        return;
      }
      
      const oldIndex = cards.findIndex((card) => card.idCard === activeId);
      const newIndex = cards.findIndex((card) => card.idCard === overId);
  
      if (oldIndex === -1 || newIndex === -1) {
        console.log('index no encontrados')
        return;
      }

      if (oldIndex === newIndex && origenGroup?.idList === idList) {
        console.log('index iguales');
        return;
      }
      
      let updatedCards = arrayMove(cards, oldIndex, newIndex);
  
      const prevCard = updatedCards[newIndex - 1];
      const postCard = updatedCards[newIndex + 1];
      let newOrderCard = 0;
  
      if (prevCard && postCard) {
        newOrderCard = (prevCard.order + postCard.order) / 2;
      } else if (prevCard) {
        newOrderCard = prevCard.order + 10;
      } else if (postCard) {
        newOrderCard = postCard.order - 10;
      }
  
      updatedCards[newIndex].order = newOrderCard;
  
      // Detectar duplicados o negativos
      const hasDuplicates = updatedCards.some((card, index, arr) =>
        arr.some((otherCard, otherIndex) => otherIndex !== index && otherCard.order === card.order)
      );
  
      const hasNegativeOrders = updatedCards.some((card) => card.order < 0);

      const updateOrders = hasDuplicates || hasNegativeOrders;

      if (!idListDestiny) {
        console.log('no se halló overGroup');
        return
      }

      if (!origenGroup) {
        console.log('no se halló origenCardGroup')
        return
      }

      if (origenGroup.idList === idListDestiny) {
        console.log('card arrastrada dentro de su propia lista');
        if (updateOrders) {
          updatedCards = updatedCards.sort((a, b) => a.order - b.order).map((card, index) => ({ ...card, order: index * 10 }));
          updateOrderCards({ idBoard, idList, updatedCards });
          console.log('se reseteó las cards donde la card fue movida dentro de su propia lista');
        } else {
          updateOrderCard({idBoard, idList, card: updatedCards[newIndex]});
          console.log('se cambió unicamente el order de una card dentro de su propia lista');
        }
      } else {
        moveCardThoAnotherList({
          idBoard,
          idListOrigen: origenGroup.idList,
          idListDestiny: idListDestiny,
          card: updatedCards[newIndex],
          updateCards: updateOrders ? updatedCards : undefined
        });
        
        console.log('se movió card a otra lista')
      }

      // cardsServices({
      //   updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
      //     if (cardGroup.idBoard === idBoard && cardGroup.idList === origenGroup.idList) { //cardsGroup[groupOrigenCard].idList
      //       return { ...cardGroup, cards: cardGroup.cards.filter((card) => card.idCard !== updatedCards[newIndex].idCard) };
      //     }
      //     return cardGroup;
      //   })
      // });

      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === idList) {
            return { ...cardGroup, cards: updatedCards };
          }
          return cardGroup;
        })
      });

      setOrigenGroup(null);
      setActiveList(null);
      setActiveCard(null);
      setListToActiveCard(null);
    }

    //CARD MOVIDA A OTRA LISTA
    // if (typeActive === 'card' && typeOver === 'list') {
    //   console.log('la card cayo en otra lista');

    //   const idList = overId;
        
    //   const origenCardGroup = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId)); //esta variable es para sacar el idList y para obtener la card a mover
    //   if (!origenCardGroup) return;

    //   const cardToMove = origenCardGroup.cards.find((card) => card.idCard === activeId);
    //   if (!cardToMove) return;
  
    //   if (userAuth) {
    //     const cardsUpdate = useCardsStore.getState().cardsGroup.find(cardGroup => cardGroup.idList === idList)?.cards;
    //     if (!cardsUpdate) return;

    //     moveCardThoAnotherList({ 
    //       idBoard, 
    //       idListOrigen: origenCardGroup.idList,
    //       idListDestiny: idList as string, 
    //       card: cardToMove
    //     });
    //   }
  
    //   return;
    // }

    setOrigenGroup(null);
    setActiveList(null);
    setActiveCard(null);
    setListToActiveCard(null);
  
    //LISTA MOVIDA (reordenamiento visual)
    // if (typeActive === 'list' && typeOver === 'list') {
    //   const oldIndex = lists.findIndex((list) => list.idList === activeId);
    //   const newIndex = lists.findIndex((list) => list.idList === overId);
  
    //   if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
  
    //   const updatedLists = arrayMove(lists, oldIndex, newIndex);
  
    //   // 🔥 Actualizar orden real en backend
    //   updated({
    //     idBoard,
    //     updatedLists: updatedLists.map((list, index) => ({
    //       ...list,
    //       order: index * 10
    //     }))
    //   });
  
    //   return;
    // }
    console.log('finalizó dragEnd');
  };
  
  return (
    <div className='board' >
      <header className='header_board'>
        <h2 className='inter_title'>{currentBoard?.nameBoard}</h2>                                      {/* NAME BOARD */}
      </header>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <div className='board_content'>
        {
        currentLists !== undefined && (
          <SortableContext 
            items={currentLists.map((list) => list.idList)}
            strategy={verticalListSortingStrategy}
            >
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

        <DragOverlay dropAnimation={null}>
          { activeList && currentBoard && activeList && <List board={currentBoard} list={activeList} />}
          { activeCard && currentBoard && listToActiveCard && activeCard && <Card board={currentBoard} list={listToActiveCard} card={activeCard} /> }
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