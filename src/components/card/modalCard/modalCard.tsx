import '../../../styles/components/card/modalCard/modalCard.scss';
import { BoardProps, ListProps, CardProps } from '../../../types/boardProps';
//COMPONENTS
import { CardModalCover } from "./modalComponents/cover/cardModalCover";
import { BtnOpenTags } from "./modalComponents/btnOpenTags/btnOpenTags";
import { TitleModalCard } from "./modalComponents/titleModalCard";
import { BtnRemoveCard } from "./modalComponents/btnOpenTags/btnRemoveCard";
import { ActiveTags } from "./activeTags";
import { CardDescription } from './modalComponents/cardDescription';

interface ModalTargetComponentProps {
    card: CardProps
    list: ListProps
    board: BoardProps
    closeModal: () => void
}

export const CardModal: React.FC<ModalTargetComponentProps> = ({ card, list, board, closeModal }) => {

    return (
        <div className='modal_show' onPointerDown={(e) => e.stopPropagation()}>
            <CardModalCover card={card} idBoard={board.idBoard} idList={list.idList} closeModal={closeModal} />

            <div className='btns_modal'>             {/*SIDEBAR*/}
                <BtnOpenTags board={board} list={list} card={card} />
                <button className='btn_modal_sidebar'>Editar</button>
                <BtnRemoveCard idBoard={board.idBoard} list={list} card={card} />
            </div>

            <TitleModalCard board={board} list={list} card={card} />
            
            <div className='modal_content_container'>         {/*CONTENIDO*/}
                <div className='modal_content'>
                    <div>
                        <CardDescription card={card} idList={list.idList} idBoard={board.idBoard} />
                    </div>
                </div>
                <div className='sidebar_tags'>
                    <ActiveTags board={board} list={list} card={card} />   
                </div>
            </div>
        </div>
    )
}