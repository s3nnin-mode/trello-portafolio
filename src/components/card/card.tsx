import React from "react";
import '../../styles/components/card/card.scss';
import { useState } from "react";
import { CardModal } from "./modalCard/modalCard";
import { BoardProps, ListProps, TagsProps, CardProps } from '../../types/boardProps';
import { useTagsStore } from "../../store/tagsStore";
import { CardCover } from "./cardCover";
import { MdDescription } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { GoEyeClosed } from "react-icons/go";

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { betterColorText } from "../../utils/tagsColors";

interface TargetComponentProps {
  card: CardProps
  board: BoardProps
  list: ListProps
}

export const Card: React.FC<TargetComponentProps> = ({card, board, list}) => {
  const { tags } = useTagsStore();
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  if (!card) return null;

  const isActive = ({tag}: {tag: TagsProps}) => {
    return tag.cardsThatUseIt.some((t) =>
      t.idBoard === board.idBoard && 
      t.idList === list.idList && 
      t.idCard === card.idCard 
    )
  }

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({
    id: card.idCard,
    data: {
      type: 'card',
      card
    }
  });

  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition
  };

    if (isDragging) {
        return (
            <article
            ref={setNodeRef}
            style={{...style, opacity: 0.5}}
            className='cardItem' >

            <CardCover idBoard={board.idBoard} list={list} card={card} isPlaying={isPlaying} />

            <div className='content_card'>
                <ul className='tags_active'>
                {   
                    tags.map((tag) => 
                        isActive({tag}) ? 
                        <li key={tag.idTag} style={{backgroundColor: tag.color}} className='active_tag_view_on_card'>
                            { tag.nameTag }
                        </li> :
                        null
                    )
                }
                </ul>
                <p className='name_target'>{card.nameCard}</p>   {/*NOMBRE DE LA TARJETA*/}
            </div>
            <footer className='footer_card_info'>
                { card.description !== null && <MdDescription /> } {/*ICON DESCRIPTION*/}
            </footer>
        </article>
        )
    }

  return(
    <>
      <article
        ref={setNodeRef}
        style={style}
        className='cardItem'
        {...attributes}
        {...listeners}
        onClick={() => { setShowCardModal(true)}}
        onMouseEnter={() => setIsPlaying(true)}
        onMouseLeave={() => setIsPlaying(false)}
      >
        {
          !showDescription && (
            <>
              <CardCover idBoard={board.idBoard} list={list} card={card} isPlaying={isPlaying} />
          
              <div className='content_card'>
                <ul className='tags_active'>
                {   
                  tags.map((tag) => 
                    isActive({tag}) ? 
                    <li key={tag.idTag} style={{color: betterColorText(tag.color), backgroundColor: tag.color}} className='active_tag_view_on_card'>
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
          )
        }

        { 
          showDescription && (
          // <div className='description_modal'>
            <Fade in={showDescription}>
              <Box 
                onClick={(e) => e.stopPropagation()}
                className='description_modal'
              >
                <div className='description_header'>
                  <p className='description_title roboto_light'>
                    <span>Descripción de </span>{card.nameCard}
                  </p>
                  <button>
                    <GoEyeClosed 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDescription(false);
                      }
                      }
                      className='icon_close_description' 
                    />
                  </button>
                </div>
                
                <p className='description_text roboto'>
                {
                  card.description
                }
                </p>
              </Box>
            </Fade>
          // </div>
        )
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