// import { FaImage } from 'react-icons/fa';
import '../../../../../styles/components/card/modalCard/modalComponents/cover/coverCardModal.scss';
import { CardProps } from '../../../../../types/boardProps';
import { useEffect, useState } from 'react';
import { SettingsCover } from './settingsCoverCard';
//ICONS
import { IoMdClose } from 'react-icons/io';
// import { CiSettings } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { CheckAnimation } from '../../../../animations/checked';
import { useCardsServices } from '../../../../../services/cardsServices';
import { useAuthContext } from '../../../../../customHooks/useAuthContext';
import { updateCompleteCard } from '../../../../../services/firebase/updateData/updateCards';
// import { useCardsStore } from '../../../../../store/cardsStore';


interface CardModalCoverProps {
  idBoard: string
  idList: string
  card: CardProps
  closeModal: () => void
}

export const CardModalCover: React.FC<CardModalCoverProps> = ({card, idList, idBoard, closeModal}) => {
  const [isEditCover, setIsEditCover] = useState(false);
  const { cardsServices } = useCardsServices();
  const { userAuth } = useAuthContext();
  // const { cardsGroup } = useCardsStore();
  const [currentCard, setCurrentCard] = useState<CardProps | null>(null);

  useEffect(() => {
    setCurrentCard(card);
  }, []);

  const cardComplete = () => {
    const idCard = card.idCard;

    if (userAuth) {
      updateCompleteCard({
        idBoard,
        idList,
        idCard: card.idCard,
        complete: !card.complete
      });
    }

    if (currentCard) setCurrentCard({...currentCard, complete: !currentCard.complete});

    cardsServices({
      updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
        cardGroup.idBoard === idBoard && cardGroup.idList === idList
        ? {...cardGroup, cards: cardGroup.cards.map((card) => card.idCard === idCard 
            ? { ...card, complete: !card.complete }
            : card
          )
        }
        : cardGroup
      )
    })
  }

  return (
    <>
      <header className='header_modal_card' >
        <div className='container_color_card' onClick={() => setIsEditCover(true)}>
          {
            currentCard && currentCard.complete 
            ? <CheckAnimation 
              isPlaying={true} 
              handleClick={(e) => {e.stopPropagation(); cardComplete()}} 
              className='card_complete' 
            />
            : <input 
              type='checkbox'
              onClick={(e) => e.stopPropagation()}
              onChange={cardComplete}
              className='checkbox_header_modal'
            /> 
          }
          <div style={{backgroundColor: currentCard?.coverColorCard ? currentCard?.coverColorCard : 'grey'}} />
          <div style={{backgroundColor: currentCard?.coverColorCard ? currentCard?.coverColorCard : 'grey'}} />
          <IoMdSettings className='icon_open_settings_cover' />
        </div>
        
        {
          currentCard && currentCard.coverImgCard !== null 
          ? <img className='img_cover_modal' src={currentCard.coverImgCard} alt='cover card' /> 
          : <div />
        }

        <button className='btn_close_modal_card' onClick={closeModal} >
          <IoMdClose />
        </button>
       
      </header>

      {
        isEditCover && currentCard && (
          <SettingsCover 
            openSettingsCover={isEditCover} 
            idBoard={idBoard} 
            idList={idList} 
            card={currentCard}
            updatedLocalCard={(cardUpdated: CardProps) => setCurrentCard(cardUpdated)}
            closeComponent={() => setIsEditCover(false)} 
          />
        )
      }

    </>
  )
}