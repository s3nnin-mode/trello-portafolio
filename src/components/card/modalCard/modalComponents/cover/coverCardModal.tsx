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
      <header 
          // style={{backgroundColor: card.currentCoverType === 'color' ? card.coverCard : '' }} 
          className='header_modal_card'>

          {/* <div className='btns_header_modal_card'>
              <button 
                  className='btn_close_modal_card'
                  onClick={closeModal}>
                  <IoMdClose />
              </button>

              <button className='btn_open_setting_cover' onClick={() => setIsEditCover(true)}>
                  <FaImage />
                  <p>Portada</p>
              </button>
          </div> */}
        <button className='btn_close_modal_card' onClick={closeModal} >
          <IoMdClose />
        </button>

        {/* className='color_preview' */}

        {
          card.coverColorCard !== null && (
            <div className='container_color_card' onClick={() => setIsEditCover(true)}> 
              <div style={{backgroundColor: card.coverColorCard}} />
              <div style={{backgroundColor: card.coverColorCard}}>
              </div> 
              <IoMdSettings className='icon_open_settings_cover' />
            </div>
          )
        }
        
        {
          card.coverImgCard !== null && <img src={card.coverImgCard} alt='cover card' />
        }

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