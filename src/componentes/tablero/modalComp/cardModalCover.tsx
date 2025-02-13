import { FaImage } from 'react-icons/fa';
import '../../../styles/tablero/list/modalCard/components/coverModalCard.scss';
import { CardProps } from '../../../types/boardProps';
import { useEffect, useState } from 'react';
import { SettingsCover } from './settingsCoverCard';
import { IoMdClose } from 'react-icons/io';

interface CardModalCoverProps {
    idBoard: string
    idList: string
    card: CardProps
    closeModal: () => void
}

export const CardModalCover: React.FC<CardModalCoverProps> = ({card, idList, idBoard, closeModal}) => {
    const [isEditCover, setIsEditCover] = useState(false);

    useEffect(() => {
        console.log('imgsss: ', card.coverCardImgs); // Verifica el contenido antes de mapear
    }, [])

    return (
        <header 
            style={{backgroundColor: card.currentCoverType === 'color' ? card.coverCard : '' }} 
            className='header_modal_card'>

            <div className='btns_header_modal_card'>
                <button 
                    className='btn_close_modal_card'
                    onClick={closeModal}>
                    <IoMdClose />
                </button>

                <button className='btn_open_setting_cover' onClick={() => setIsEditCover(true)}>
                    <FaImage />
                    <p>Portada</p>
                </button>
            </div>

            {
                card.currentCoverType === 'color' ?
                <div style={{backgroundColor: card.coverCard}} className='color_preview' /> :
                <img src={card.coverCard} alt='cover card' />
            }

            {
                isEditCover && <SettingsCover idBoard={idBoard} idList={idList} card={card} closeComponent={() => setIsEditCover(false)} />
            }
        </header>
    )
}