import '../../../../styles/components/card/modalCard/modalComponents/cardDescription.scss';
import { MdDescription } from "react-icons/md";
import { CardProps } from "../../../../types/boardProps";
import React, { useEffect, useState } from "react";
import { useCardsServices } from "../../../../services/cardsServices";
import { useAuthContext } from '../../../../customHooks/useAuthContext';
import { updateDescriptionCard } from '../../../../services/firebase/updateData/updateCards';
import { MdEditDocument } from "react-icons/md";

import { TbFileDescription } from 'react-icons/tb';
interface CardDescriptionProps {
  card: CardProps
  idBoard: string
  idList: string
}

export const CardDescription: React.FC<CardDescriptionProps> = ({card, idList, idBoard}) => {
  const { cardsServices } = useCardsServices();
  const [showTextarea, setShowTextarea] = useState(false);
  const [showAllDescription, setShowAllDescription] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { userAuth } = useAuthContext();

  useEffect(() => {
    if (card.description) {
      setInputValue(card.description);
    }
  }, []);

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    target.style.height = "auto"; 
    target.style.height = `${target.scrollHeight}px`;
  }

  const saveDescription = () => {
    const idCard = card.idCard;
    if (userAuth) {
      updateDescriptionCard({
        idBoard, 
        idList, 
        idCard, 
        description: inputValue
      })
    }
    cardsServices({
      updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
      cardGroup.idBoard === idBoard && cardGroup.idList === idList ?
      {
        ...cardGroup,
        cards: cardGroup.cards.map((card) =>
        card.idCard === idCard ?
        { ...card, description: inputValue || null }
        :
        card
        ) 
      }
      :
      cardGroup
      )
    });
    setShowTextarea(false);
  }
    
  return (
    <div className='container_card_description_modal'>
      <h5 className='inter_title'>
        Descripción
        {card.description && <TbFileDescription className='description_notification' />}
      </h5>
      {
        !showTextarea && (
          card.description !== null ?
          <div
            // style={{
            // color: showAllDescription ? '#2e2e2e' : '#ccc',
            // boxShadow: showAllDescription ? 'inset 0 0 15px #2e2e2e' : 'none',
            // backgroundColor: showAllDescription ? '#ccc' : 'transparent'
            // }} 
            className='container_description_text'>
            
            <p className='description_text'>
              {card.description.length > 30 ?
              <>
                {!showAllDescription ? card.description.slice(0, 29) : card.description}
                {!showAllDescription && <span className='span_expand_text' onClick={() => setShowAllDescription(true)}> ...ver mas</span>}
              </>
              :
                card.description
              }
            </p>
            <header>
              <button 
              // style={{
              //   boxShadow: showAllDescription ? 'inset 0 0 3px #1e1e1e' : 'none',
              //   background: 'transparent',
              //   // backgroundColor: showAllDescription ? 'transparent' : 'transparent',
              //   color: showAllDescription ? '#2e2e2e' : '#ccc'
              // }}
                className='btn_open_textarea' onClick={() => setShowTextarea(!showTextarea)}>
                <MdEditDocument className='icon_description_card_modal'/>
                <span>Editar descripción</span>
              </button>
              {
                showAllDescription && (
                <button 
                  className='btn_collapse_text'
                  onClick={() => setShowAllDescription(false)}
                >
                  ver menos
                </button>
                )
              }
            </header>
          </div>
            :
            <div className='container_no_description'>
              <span className='no_description_text inter'>Sin descripcion...</span>
              <button 
                className='btn_open_textarea' 
                onClick={() => setShowTextarea(!showTextarea)}
              >
                <MdDescription className='icon_description_card_modal'/>
                <span className='work_sans_btn'>Agregar descripción</span>
              </button>
            </div>
          //
        )
      }

      {/* {
        !showTextarea && showAllDescription &&  (
          card.description && (
          <div className='container_description_text'>
            <button className='btn_open_textarea' onClick={() => setShowTextarea(!showTextarea)}>
              <MdEditDocument className='icon_description_card_modal'/>
              <span>Editar descripción</span>
            </button>
            <p className='description_text'>
              {
                card.description.length > 30 ?
                `${card.description.slice(0, 29)}...` :
                card.description
              }
            </p>
          </div>
          )
        )
      } */}
      
      {
        showTextarea && (
          <form>
            <textarea
            className='inter'
              placeholder='Agrega una descripción para tu tarjeta, por ejemplo'
              onKeyDown={(e) => e.stopPropagation()} 
              onInput={onInput}
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
            />
              <div>
                <button type='button' onClick={saveDescription}>Guardar</button>
                <button type='button' onClick={() => setShowTextarea(false)}>Cancelar</button>
              </div>
          </form>
        )
      }
    </div>
  )
}