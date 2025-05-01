import '../../styles/components/boards/board.scss';
//HOOKS
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
//COMPONENTS
import { List } from '../list/list';
import { Card } from '../card/card';
import { BtnAdd } from '../reusables/btnAgregar';
//DND-KIT
import {  DragOverlay, DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors, pointerWithin, TouchSensor } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';

//STORES
import { useListsStore } from '../../store/listsStore';
import { useBoardsStore } from '../../store/boardsStore';
//TYPES
import { BoardProps, CardGroupProps, CardProps, ListProps } from '../../types/boardProps';
import { useListsServices } from '../../services/listsServices';
import { useCardsServices } from '../../services/cardsServices';
import { useCardsStore } from '../../store/cardsStore';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { addListFirebase, updateOrderListsFirebase, updtateOrderList } from '../../services/firebase/updateData/updateLists';
import { moveCardThoAnotherList, updateOrderCard, updateOrderCards } from '../../services/firebase/updateData/updateCards';
import { useTagsService } from '../../services/tagsServices';
import { CardModal, getBoard } from '../card/modalCard/modalCard';
import { getCardsFirebase, getListsFirebase, getTagsFirebase } from '../../services/firebase/firebaseFunctions';
import { useTagsStore } from '../../store/tagsStore';
import { Sidebar } from './sidebar';

import { MdChevronLeft } from "react-icons/md";
// import { snapCenterToCursor,  } from '@dnd-kit/modifiers';

export const isTouchDevice = () => {
  if (typeof window !== "undefined") {
    return (
      "ontouchstart" in window
      // navigator.maxTouchPoints > 0 Quité esta linea porque en mi laptop me da '1', y me bloquea el hacer drag
    );
  }
  return false;
}

const useCustomBoard = () => {
  const { listsGroup, loadLists } = useListsStore();
  const { boards, loadBoards } = useBoardsStore();
  const { listsService } = useListsServices();
  const { createCardGroup } = useCardsServices();
  const { userAuth, getUserAuthState } = useAuthContext();

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
      order: lastList ? lastList.order + 10 : 0,
      archived: false
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

  const isTouch = isTouchDevice();

  const sensors = useSensors(
    isTouch 
    ? useSensor(TouchSensor, {
        activationConstraint: {
          delay: 350,
          tolerance: 5,
          distance: 5
        },
      })
    : useSensor(PointerSensor, {
        activationConstraint: {
          distance: 1
        }
      })
  );

  return { addNewList, boards, listsGroup, loadLists, loadBoards, getUserAuthState, sensors }
}

export const Tablero = () => {
  const { listsService } = useListsServices();
  const { boards, listsGroup, loadLists, loadBoards, getUserAuthState, sensors, addNewList } = useCustomBoard();
  const [currentBoard, setCurrentBoard] = useState<BoardProps>();
  const [idBoard, setIdBoard] = useState('');
  const { userAuth } = useAuthContext();
  const { tagsServices } = useTagsService();
  const { cardsServices } = useCardsServices();
  const { cardsGroup, loadCards } = useCardsStore();
  const { loadTags } = useTagsStore();

  const [currentLists, setCurrentLists] = useState<ListProps[]>()
  const { currentIdBoard } = useParams(); //RUTA ACTUAL

  const [activeList, setActiveList] = useState<ListProps | null>(null); //esto es para saber que lista esta siendo arrastrada y crear un efecto visual
  const [activeCard, setActiveCard] = useState<CardProps | null>(null);
  const [listToActiveCard, setListToActiveCard] = useState<ListProps | null>(null);
  let origenGroupRef = useRef<CardGroupProps | null>(null);

  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  if (!currentIdBoard) {
    return <p>Tablero no encontrado</p>
  }

  useEffect(() => {

    const fetchData = async () => {
      const user_Auth = await getUserAuthState();
      if (user_Auth) {
        setLoader(false);

        const boardData = await getBoard(currentIdBoard);
        loadBoards([boardData]);

        const listsData = await getListsFirebase(currentIdBoard);

        const lists = [{
          idBoard: currentIdBoard,
          lists: listsData
        }];

        loadLists(lists);
        console.log('se cargaron listas de tablero: ', listsData, lists)
    
        const fetchCards = async () => {
          return Promise.all(listsData.map(async list => {
            const cards = await getCardsFirebase(currentIdBoard, list.idList);
            
            const cardGroup: CardGroupProps = {
              idBoard: currentIdBoard,
              idList: list.idList,
              cards
            }
            return cardGroup
          }))
        }
  
        const cardsGroup = await fetchCards();
        loadCards(cardsGroup);

        const tags = await getTagsFirebase();
        loadTags(tags);

        return
      }

      const boardsLS = localStorage.getItem('boards-storage');
      const listsLS = localStorage.getItem('lists-storage');
      const cardsLS = localStorage.getItem('cards-storage');
      const tagsLS = localStorage.getItem('tags-storage');
  
      if (boardsLS && listsLS && cardsLS && tagsLS) {
        setLoader(false);

        loadBoards(JSON.parse(boardsLS));
        loadLists(JSON.parse(listsLS));
        loadCards(JSON.parse(cardsLS));
        loadTags(JSON.parse(tagsLS));
        return
      }

      setLoader(false);
      navigate('/');
    }

    fetchData();
  }, []); //se carga los datos del tablero actual según la ruta

  useEffect(()=> {
    const indexBoard = boards.findIndex(b => b.idBoard === currentIdBoard);
    if (indexBoard > -1) {
      console.log('se halló indexBoard', indexBoard, boards[indexBoard]);
      setCurrentBoard(boards[indexBoard]);
      setIdBoard(boards[indexBoard].idBoard);
      return
    } else {
      console.log('no hay indexBoard', indexBoard, currentIdBoard, boards);
    }
  }, [boards, currentIdBoard]);

  useEffect(() => {
    const indexListGroup = listsGroup.findIndex((listGroup) => listGroup.idBoard === currentIdBoard);
    if (indexListGroup > -1) {
      setCurrentLists(listsGroup[indexListGroup].lists.filter(list => list.archived === false));
    }
  }, [listsGroup]);

  const onDragStart = (event: DragStartEvent) => {

    console.log('SE EJECUTO ONDRAGSTART')
    if (event.active.data.current?.type === 'list') {
      setActiveList(event.active.data.current.list);
      return;
    }
    
    if (event.active.data.current?.type === 'card') {
      if (activeCard === null) {
        setActiveCard(event.active.data.current.card);
        console.log('activeCard en onDragStart!', event.active.data.current.card);
      }

      if (origenGroupRef.current === null) {
        
        const cardGroup = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === event.active.data.current?.card.idCard));
        if (!cardGroup) return;
        origenGroupRef.current = cardGroup;
        
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
      //Esto es para cuando cae en su propia posición
      
      console.log('////////')
      console.log('activeID y overId son iguales en DragOver');
      console.log(activeId, overId)
      console.log('////////')
      return;
    } else {
      console.log('////////')
      console.log('activeID y overId NO son iguales en DragOver');
      console.log(activeId, overId)
      console.log('////////')
    }

    const isActiveCard = active.data.current?.type === 'card';
    const isOverList = over.data.current?.type === 'list';

    const origenCardGroup = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId)); //esta variable es para sacar el idList y para obtener la card a mover
   
    //A veces cuando se arrastra una card, detecta su propia lista contenedor y se ejecuta esto inncesariamente. 
    //Eso no es lo esperado, esta función solo se debe hacer esto cuando la card esta sobre otra lista
    //Por eso la condicional si overId es diferente del grupo al que pertenece actualmente la card
    if (isActiveCard && isOverList && overId !== origenCardGroup?.idList) {
      const idList = overId;
        
      // const origenCardGroup = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId)); //esta variable es para sacar el idList y para obtener la card a mover
      
      // const cardToMove = origenGroup.cards.find((card) => card.idCard === activeId);
      const cardToMove = activeCard;
      if (!cardToMove) return;

      //Se elimina la card del cardGroup al que estaba
      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === origenCardGroup?.idList) { //origenGroupRef.current?.idList
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

      return;
    }

  }

  const onDragEnd = (event: DragEndEvent) => {
    console.log('inicia onDragEnd')
    const { active, over } = event;
    if (!over) {
      console.log('NO HAY OVERRR');
      setActiveCard(null);
      origenGroupRef.current = null;
      setActiveList(null);
      setListToActiveCard(null);
      return
    }
  
    const activeId = active.id;
    const overId = over.id;

    const typeActive = active.data.current?.type;
    const typeOver = over.data.current?.type;

    const idListDestiny = typeOver === 'card' //Cuando una card se deja caer sobre otra lista puede caer sobre la lista o sobre la card
    ? cardsGroup.find(cardGroup => cardGroup.cards.some(card => card.idCard === overId))?.idList 
    : overId;

    if (activeId === overId && idListDestiny === origenGroupRef.current?.idList) {
      console.log('activeId y overId son iguales');
      console.log('activeId', activeId);
      console.log('overId', overId);
      setActiveCard(null);
      origenGroupRef.current = null;
      setActiveList(null);
      setListToActiveCard(null);
      console.log('se dio null a todos los estados del drag');
      return;
    }
  
    if (typeActive === 'card' && typeOver === 'card' || typeActive === 'card' && typeOver === 'list') {
      console.log('si entra a condicional');

      // const idList = cardsGroup.find((cardGroup) => cardGroup.cards.some((card) => card.idCard === activeId))?.idList; //este idList de la lista en donde se dejó caer la card, no se usa la de origen group porque ese es el origen
      // if (!idList) return;
  
      const cards = cardsGroup.find((group) => group.idBoard === idBoard && group.idList === idListDestiny)?.cards; //aqui usabas idList
      if (!cards) {
        console.log('no se encontró cards');
        setActiveCard(null);
        origenGroupRef.current = null;
        setActiveList(null);
        setListToActiveCard(null);
        return;
      }
      
      const oldIndex = cards.findIndex((card) => card.idCard === activeId);
      const newIndex = typeOver === 'card' 
        ? cards.findIndex(card => card.idCard === overId) 
        : cards.length - 1;
  
      if (oldIndex === -1 || newIndex === -1) {
        console.log('index no encontrados')
        setActiveCard(null);
        origenGroupRef.current = null;
        setActiveList(null);
        setListToActiveCard(null);
        return;
      }

      if (oldIndex === newIndex && origenGroupRef.current?.idList === idListDestiny) { //aqui usabas idList
        console.log('index iguales');
        setActiveCard(null);
        origenGroupRef.current = null;
        setActiveList(null);
        setListToActiveCard(null);
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
        setActiveCard(null);
        origenGroupRef.current = null;
        setActiveList(null);
        setListToActiveCard(null);
        return
      }

      if (!origenGroupRef.current) {
        console.log('no se halló origenCardGroup')
        setActiveCard(null);
        origenGroupRef.current = null;
        setActiveList(null);
        setListToActiveCard(null);
        return
      }

      cardsServices({ //Esto actualiza el estado de zustand
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => {
          if (cardGroup.idBoard === idBoard && cardGroup.idList === idListDestiny) { //aqui usabas idList
            return { ...cardGroup, cards: updatedCards };
          }
          return cardGroup;
        })
      });

      if (userAuth) {
        if (origenGroupRef.current.idList === idListDestiny) {
          console.log('card arrastrada dentro de su propia lista');
          if (updateOrders) {
            updatedCards = updatedCards.sort((a, b) => a.order - b.order).map((card, index) => ({ ...card, order: index * 10 }));
            updateOrderCards({ idBoard, idList: idListDestiny, updatedCards }); //aqui usabas idList
            console.log('se reseteó las cards donde la card fue movida dentro de su propia lista');
          } else {
            updateOrderCard({idBoard, idList: idListDestiny, card: updatedCards[newIndex]}); //aqui usabas idList
            console.log('se cambió unicamente el order de una card dentro de su propia lista');
          }
        } else {
          moveCardThoAnotherList({
            idBoard,
            idListOrigen: origenGroupRef.current.idList,
            idListDestiny: idListDestiny as string,
            card: updatedCards[newIndex],
            updateCards: updateOrders ? updatedCards : undefined
          });  
          console.log('se movió card a otra lista')
        }
      }

      origenGroupRef.current = null;
      setActiveCard(null);
      setListToActiveCard(null);

      return;

    } else {
      console.log('EN ONDRAGEND NO ENTRA A LA LOGICA DE SI EL TIPO DE AMBOS ES CARD');
      console.log('activeId y overId', activeId, overId);
      console.log('types', typeActive, typeOver)
    }

    // origenGroupRef.current = null;
    // setActiveCard(null);
    // setListToActiveCard(null);
    
    //Para el arrastre de listas
    if (typeActive === 'list' && typeOver === 'list') {
      console.log('se estan arrastrando listas')
      if (!currentLists) {
        console.log('se retornó porque no hay currentLists');
        return
      }

      const oldIndex = currentLists.findIndex(list => list.idList === active.id);
      const newIndex = currentLists.findIndex(list => list.idList === over?.id);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        setActiveCard(null);
        origenGroupRef.current = null;
        setActiveList(null);
        setListToActiveCard(null);
        console.log('Se canceló el drag (no hay cambios en la posición)');
        return;
      }

      let lists = arrayMove(currentLists, oldIndex, newIndex);

      if (userAuth) {
        const prevList = lists[newIndex - 1];
        const postList = lists[newIndex + 1];
        let newOrder = 0;

        if (prevList && postList) {
          newOrder = (prevList.order + postList.order) / 2;
          console.log('cayó en medio');
        } else if (prevList) {
          newOrder = prevList.order + 10;
          console.log('cayó al final')
        } else if (postList) { //aqui falta optimizar para no tener valores negativos en el order de alguna lista
          newOrder = postList.order - 10;
          console.log('cayó al principió');
        } else {
          console.log('no cayó en ningún lado')
        }

        lists = lists.map((list, index) => {
          if (index === newIndex) {
            return {...list, order: newOrder}
          } 
          return list;
        });

        updtateOrderList({idBoard, list: lists[newIndex]});
        console.log('se actualizo el order de la lista movida');
        console.log('asi quedaron las listas', lists);

        const hasDuplicates = lists.some((list, index, arr) => 
          arr.some((otherList, otherIndex) => otherIndex !== index && otherList.order === list.order)
        );
      
        const hasNegativeOrders = lists.some(list => list.order < 0);
        
        if (hasDuplicates || hasNegativeOrders) {
          lists = lists.map((list, index) => ({ ...list, order: index * 10 }));
    
          updateOrderListsFirebase({ idBoard, updatedLists: lists });
          console.log('Se reorganizaron los orders en drag and drop: ', lists);
        }
      };

      listsService({
        updateFn: (listsGroup) => listsGroup.map((listGroup) => listGroup.idBoard === idBoard ? { ...listGroup, lists: lists } : listGroup)
      });
    }
    setListToActiveCard(null);
    setActiveList(null);
    console.log('finalizó dragEnd');
  };

  if (loader) {
    return (
      <div className='container_loader_board'>
        <div className='loader_board'></div>
      </div>
    )
  } 
  
  return (
    <>
    <Sidebar />
    <div className={`board`} >
      
      <header className='header_board'>
        <button>
          <MdChevronLeft onClick={() => navigate('/kanbaX')} className='icon_back_home' />
        </button>
        <h2 className='inter_title'>{currentBoard?.nameBoard}</h2>                                     {/* NAME BOARD */}
      </header>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={pointerWithin}
      >
        <div 
        // className={`board_content ${activeList ? 'is_dragging_list' : ''}`}
        className='board_content'
        >
          {
          currentLists !== undefined && (
            <SortableContext 
              items={currentLists.map((list) => list.idList)}
              strategy={horizontalListSortingStrategy}
            >
              {
                currentBoard && (               //antes de pasar board verifico que exista
                  currentLists.map((list) => {
                    return <List isActiveList={activeList ? true : false} board={currentBoard} list={list} key={list.idList} />
                  })
                )
              }
            </SortableContext>
          )
          }

          <DragOverlay dropAnimation={null}>
            { activeList && currentBoard && <List className='is_overlay_list' board={currentBoard} list={activeList} />}
            { activeCard && currentBoard && listToActiveCard && <Card className='card_overlay' board={currentBoard} list={listToActiveCard} card={activeCard} /> }
          </DragOverlay>

          <BtnAdd
            className='form_add_list'
            createListOrTargetName={(value: string) => addNewList({value, idBoard})}
            nameComponentToAdd='list'
          />

        </div>
      </DndContext>

      <Routes>
        <Route path='list/:idList/card/:idCard' element={<CardModal />} />
      </Routes>
    </div>
    </>
  )
};