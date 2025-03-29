// import { FaImage } from 'react-icons/fa';
import '../../../../../styles/components/card/modalCard/modalComponents/cover/coverCardModal.scss';
import { CardProps } from '../../../../../types/boardProps';
import { useState } from 'react';
import { SettingsCover } from './settingsCoverCard';
//ICONS
import { IoMdClose } from 'react-icons/io';
import { FaRegCircleCheck } from "react-icons/fa6";
// import { CiSettings } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";


interface CardModalCoverProps {
  idBoard: string
  idList: string
  card: CardProps
  closeModal: () => void
}

export const CardModalCover: React.FC<CardModalCoverProps> = ({card, idList, idBoard, closeModal}) => {
    const [isEditCover, setIsEditCover] = useState(false);

  return (
    <>
      <header className='header_modal_card' >
        <div className='container_color_card' onClick={() => setIsEditCover(true)}> 
          <div style={{backgroundColor: card.coverColorCard ? card.coverColorCard : 'grey'}} />
          <div style={{backgroundColor: card.coverColorCard ? card.coverColorCard : 'grey'}} />
          <IoMdSettings className='icon_open_settings_cover' />
        </div>
        
        {
          card.coverImgCard !== null ? <img className='img_cover_modal' src={card.coverImgCard} alt='cover card' /> : <div></div>
        }

        <button className='btn_close_modal_card' onClick={closeModal} >
          <IoMdClose />
        </button>

        {
          card.complete && (
            <div className='cover_text_card_completed'>
              <FaRegCircleCheck className='icon_completed' /> <span>Tarjeta completada</span>
            </div>
          )
        }
      </header>

      {
        isEditCover && <SettingsCover openSettingsCover={isEditCover} idBoard={idBoard} idList={idList} card={card} closeComponent={() => setIsEditCover(false)} />
      }
    </>
  )
}