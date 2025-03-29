import React, { useEffect, useState } from "react";
import '../../styles/components/list/list.scss';
//REACT-ICONS
import { RiCollapseHorizontalLine } from "react-icons/ri";
//COMPONENTS
import { SettingsList } from "./optionsList/settingsList";
import { NameComponent } from "../reusables/nameComponent";
import { BtnAdd } from "../reusables/btnAgregar";
import { Card } from "../card/card";
//DRAG AND DROP List
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
//STORES
import { useCardsStore } from "../../store/cardsStore";
//TYPES
import { BoardProps, ListProps, CardProps } from '../../types/boardProps';
import { useCardsServices } from "../../services/cardsServices";
//DRaG AND DROP CARDS
import { SortableContext } from '@dnd-kit/sortable';
import { addCardFirebase } from "../../services/firebase/updateData/updateCards";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { IconButton } from "@mui/material";


interface ListPropsComponent {
  list: ListProps
  board: BoardProps
}

export const useList = () => {
  const { cardsServices } = useCardsServices();
  const { userAuth } = useAuthContext();
  const { cardsGroup } = useCardsStore();

  const addNewCard = ({board, list, nameCard}: { board: BoardProps, list: ListProps, nameCard: string }) => {
    const idList = list.idList;
    const idBoard = board.idBoard;
    const cards = cardsGroup.find(card => card.idBoard === board.idBoard && card.idList === list.idList)?.cards;
    if (!cards) return;

    let order = cards?.length === 0 ? 0 : cards[cards?.length - 1].order + 10
    
    const newCard: CardProps = {
      idCard: (nameCard + Date.now()).toString(), 
      nameCard: nameCard,
      coverColorCard: null,
      coverImgCard: null,
      coverCardImgs: [],
      complete: false,
      description: null,
      order
    };
      
    cardsServices({
      updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
      (cardGroup.idBoard === idBoard && cardGroup.idList === idList) ?
      {...cardGroup, cards: [...cardGroup.cards, newCard]} :
      cardGroup
      )
    });

    if (userAuth) {
      addCardFirebase({idBoard, idList, card: newCard});
    }
  }

  return { addNewCard, cardsServices };
}

export const List: React.FC<ListPropsComponent> = ({ board, list }) => {               
  const { addNewCard } = useList();
  const { cardsGroup } = useCardsStore();
  const [isListCollapse, setIsListCollapse] = useState(false);
  const [currentCards, setCurrentCards] = useState<CardProps[]>([]);

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({
    id: list.idList,
    data: {
      type: 'list',
      list, 
    },
    animateLayoutChanges: () => false
  });  

  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition, 
    backgroundColor: list.colorList,
    opacity: isDragging ? 0.5 : 1
  }
    
  useEffect(() => {
    const indexCardGroup = cardsGroup.findIndex((targetGroup) => targetGroup.idBoard === board.idBoard && targetGroup.idList === list.idList);
    if (indexCardGroup > -1) {
      setCurrentCards(cardsGroup[indexCardGroup].cards);
    }
  }, [cardsGroup]);

  return (
    <div 
      ref={setNodeRef}
      {...attributes} //el drag and drop de la lista funcionará solo si se arrastra desde el header
      {...listeners}
      style={style}
      className='list' 
    >    
      <header className='header_list'>  
        <NameComponent 
          idBoard={board.idBoard} 
          list={list} 
          componentType='list'
          className='listName_container' 
        />                     
        <div className='btns_header_list'>
          <IconButton className='btn_collapse_list' onClick={() => setIsListCollapse(!isListCollapse)}>
            <RiCollapseHorizontalLine className='icon_collapse_list' />
          </IconButton>
          <SettingsList idBoard={board.idBoard} list={list} />
        </div>
      </header>
      <div 
        className='content_list' >
        <SortableContext 
          items={currentCards.map(card => card.idCard)}
          > 
          {
            currentCards.map((card) => (
              <Card 
                card={card}
                board={board}
                list={list}
                key={card.idCard}
              />
            ))
          }
        </SortableContext>
      </div>
      <footer>
        {
          list && (
            <BtnAdd 
              className='btn_add_card'
              createListOrTargetName={(nameCard: string) => addNewCard({board, list, nameCard})} 
              nameComponentToAdd='target' 
            />
          )
        }
      </footer>
    </div>
  )
}