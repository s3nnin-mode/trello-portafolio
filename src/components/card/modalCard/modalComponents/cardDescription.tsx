import '../../../../styles/components/card/modalCard/modalComponents/cardDescription.scss';
import { MdDescription } from "react-icons/md";
import { CardProps } from "../../../../types/boardProps";
import React, { useEffect, useState } from "react";
import { useCardsServices } from "../../../../services/cardsServices";
import { useAuthContext } from '../../../../customHooks/useAuthContext';
import { updateDescriptionCard } from '../../../../services/firebase/updateData/updateCards';
// import { MdEditDocument } from "react-icons/md";

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
  const [inputValue, setInputValue] = useState<string | null>(null);
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
        description: inputValue || null
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
      <h2 className=''>
        Descripción
        
      </h2>
      {
        !showTextarea && (
          inputValue !== null && inputValue?.length > 0 ?
          <div className='container_description_text'>
            
            <p className='description_text'>
              {inputValue.length > 40 ?
              <>
                {!showAllDescription ? inputValue.slice(0, 39) : inputValue}
                {!showAllDescription && <span style={{color: card?.coverColorCard || '#ccc'}} className='span_expand_text' onClick={() => setShowAllDescription(true)}> ...ver mas</span>}
              </>
              :
                `${inputValue}`
              }
            </p>
            <footer>
              <button className='btn_open_textarea' onClick={() => setShowTextarea(!showTextarea)}>
                <TbFileDescription className='icon_description_card_modal' />
                <span className='roboto_medium'>Editar descripción</span>
              </button>
              {
                showAllDescription && (                
                <button className='btn_collapse_text roboto_medium' onClick={() => setShowAllDescription(false)}>
                  ver menos
                </button>
              )
              }
            </footer>
          </div>
            :
            <div className='container_no_description'>
              <span className='no_description_text roboto_light'>Sin descripcion...</span>
              <button 
                className='btn_open_textarea' 
                onClick={() => setShowTextarea(!showTextarea)}
              >
                <MdDescription className='icon_description_card_modal' />
                <span className='roboto_medium'>Agregar descripción</span>
              </button>
            </div>
          //
        )
      }
      
      {
        showTextarea && (
          <form>
            <textarea
              className='roboto'
              placeholder='Agrega una descripción para tu tarjeta, por ejemplo'
              onKeyDown={(e) => e.stopPropagation()} 
              onInput={onInput}
              value={inputValue || ''} 
              onChange={(e) => setInputValue(e.target.value)} 
            />
              <div>
                <button style={{color: card?.coverColorCard || '#ccc'}} type='button' onClick={saveDescription}>Guardar</button>
                <button type='button' onClick={() => setShowTextarea(false)}>Cancelar</button>
              </div>
          </form>
        )
      }
    </div>
  )
}