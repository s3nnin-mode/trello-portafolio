import React from "react";
import '../../styles/components/card/card.scss';
import { useState } from "react";
import { CardModal } from "./modalCard/modalCard";
import { BoardProps, ListProps, TagsProps, CardProps } from '../../types/boardProps';
import { useTagsStore } from "../../store/tagsStore";
import { TbFileDescription } from "react-icons/tb";
import { GoEyeClosed } from "react-icons/go";

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { betterColorText } from "../../utils/tagsColors";

import { CheckAnimation } from "../animations/checked";
import { useCardsServices } from "../../services/cardsServices";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { updateCompleteCard } from "../../services/firebase/updateData/updateCards";

interface TargetComponentProps {
  card: CardProps
  board: BoardProps
  list: ListProps
}

export const Card: React.FC<TargetComponentProps> = ({card, board, list}) => {
  const { tags } = useTagsStore();
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState(false);
  const { cardsServices } = useCardsServices();
  const { userAuth } = useAuthContext();

  if (!card) return null;

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform,
    isDragging
  } = useSortable({
    id: card.idCard,
    data: {
      type: 'card',
      card
    },
    animateLayoutChanges: () => false
  });

  const style = { 
    transform: CSS.Transform.toString(transform),
    transition: 'none',
    opacity: isDragging ? 0.3 : 1,
    boxShadow: isDragging ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : '0 1.2px 3px #121212',
    cursor: isDragging ? 'grabbing' : 'pointer',
    // border: isDragging ? '2px solid red' : 'none',
  };

  const isActive = ({tag}: {tag: TagsProps}) => tag.cardsThatUseIt.some((item) => item.idCard === card.idCard);

  const cardComplete = () => {
    const idCard = card.idCard;
    if (userAuth) {
      updateCompleteCard({
        idBoard: board.idBoard,
        idList: list.idList,
        idCard: card.idCard,
        complete: !card.complete
      });
    }

    cardsServices({
      updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
        cardGroup.idBoard === board.idBoard && cardGroup.idList === list.idList
        ?
        {
          ...cardGroup,
          cards: cardGroup.cards.map((card) =>
            card.idCard === idCard 
            ?
            { ...card,
              complete: !card.complete
            }
            :
            card
          )
        }
        :
        cardGroup
      )
    })
  }

  return(
    <>
      <article
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='cardItem'
        onClick={() => { setShowCardModal(true)}}
      >
        {
          !showDescription ?
            <>
              {/* <CardCover idBoard={board.idBoard} list={list} card={card} isPlaying={isPlaying} /> */}
              <div className='card_cover'>
                <div className='color_indicator_and_img'>
                  <div 
                  style={{
                    boxShadow: card.complete ? '0 0 5px #121212' : 'none'
                  }}
                  className={card.coverImgCard ? 'container_color_card_with_img' : 'container_color_card'} >
                    {
                      card.complete ? 
                      <CheckAnimation 
                        isPlaying={true} 
                        handleClick={(e) => {e.stopPropagation(); cardComplete()}} 
                        className='card_complete' 
                      />
                      :
                      <input 
                        type="checkbox"
                        onClick={(e) => e.stopPropagation()}
                        onChange={cardComplete}
                        // className={card.complete ? 'card_complete' : 'checked_card_animation'} 
                        className='checkbox_card_complete'
                        // handleClick={cardComplete} 
                        // isPlaying={card.complete ? card.complete : isPlaying}
                      /> 
                    }
                    {
                      card.coverColorCard !== null && (
                        <>
                          <span 
                            className='circle' 
                            style={{background: card.coverColorCard}}
                          />
                          <span 
                            className='circle' 
                            style={{background: card.coverColorCard}}
                          />
                        </>
                      )
                    }
                  </div>
                  {
                    card.coverImgCard && <img src={card.coverImgCard} alt='portada tarjeta' />
                  }
                </div>
                {/* <p className='cardName roboto_light'>
                  {card.nameCard}
                </p> */}
              </div>
              <div className='content_card'>
                <p className='cardName roboto_light'>
                  {card.nameCard}
                </p>
                <ul className='tags_active'>
                {
                  tags.map((tag) => 
                    isActive({tag}) ? 
                    <li key={tag.idTag} style={{backgroundColor: tag.color, color: betterColorText(tag.color)}} className='active_tag_view_on_card'>
                      { tag.nameTag }
                    </li> :
                    null
                  )
                }
                </ul>
                {
                  card.description !== null && (
                    <button 
                      className='btn_open_description'
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDescription(true);
                      }}
                      >
                      <TbFileDescription 
                        className='description_icon'
                      />
                      <span className='roboto'>Ver descripción</span>
                    </button>
                  )
                }
              </div>
            </> 
            : 
            <Fade in={showDescription}>
            <Box 
              onClick={(e) => e.stopPropagation()}
              className='description_modal'
            >
              <div className='description_header'>
                <p className='description_title roboto_light'>
                  <span>Descripción de </span>{card.nameCard}
                </p>
                <button onClick={(e) => { e.stopPropagation(); setShowDescription(false); }}>
                  <GoEyeClosed 
                    
                    className='icon_close_description' 
                  />
                </button>
              </div>
              <p className='description_text roboto'>
              { card.description }
              </p>
            </Box>
          </Fade>
        }
        
      </article>

      {
        //M O D A L
        showCardModal && (
          <CardModal 
            card={card}
            list={list}
            board={board}
            closeModal={() => setShowCardModal(false)}
            open={showCardModal}
          />
        )
      }
    </>
  )
}