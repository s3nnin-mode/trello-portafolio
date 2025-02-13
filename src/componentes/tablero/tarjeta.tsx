import React, { useEffect } from "react";
import '../../styles/tablero/tarjeta.scss';
import { useState } from "react";
import { Modal } from "./modal";
import { BoardProps, ListProps, TagsProps, CardProps } from "../../types/boardProps";
import { useTagsStore } from "../../store/tagsStore";

interface TargetComponentProps {
    card: CardProps
    board: BoardProps
    list: ListProps
}

export const Card: React.FC<TargetComponentProps> = ({card, board, list}) => {
    const { tags } = useTagsStore();
    const [modal, setModal] = useState<boolean>(false);

    useEffect(() => {
        console.log('img en target: ', card.coverCard)
        console.log('files', card.coverCardImgs)
    }, []);

    if (!card) {
        return null
    }

    const isActive = ({tag}: {tag: TagsProps}) => {
        // console.log('taggggg: ', tag)
        // if (tag.cardsThatUseIt.length <= 0) {
        //     return false
        // } 

        return tag.cardsThatUseIt.some((t) =>
                t.idBoard === board.idBoard && t.idList === list.idList && t.idCard === card.idCard ?
                true :
                false
            )
    }

    return(
        <>
        <article className='target' onClick={() => setModal(true)} onPointerDown={(e) => e.stopPropagation()}>
            {
                card.currentCoverType === 'color' ?
                <div 
                    style={{backgroundColor: card.currentCoverType === 'color' ? card.coverCard : ''}}
                    className='color_top' /> 
                :
                <img src={card.coverCard} />
            }

            <div className='content_target'>
                <ul className='tags_active'>
                    {
                       
                        tags.map((tag) => 
                            isActive({tag}) 
                            ? 
                                <li 
                                key={tag.idTag}
                                    style={{backgroundColor: tag.color}}
                                    className='active_tag_view_on_card'
                                    >
                                        {
    
                                            tag.nameTag
                                        }
                                </li> 
                            :
                                null
                        )
                        
                    }
                </ul>
                <p className='name_target'>{card.nameCard}</p>   {/*NOMBRE DE LA TARJETA*/}
                <div className='btns_target'>
                    
                </div>
            </div>
        </article>

        {/* <!-- Modal --> */}

        {
            modal && (
                <Modal 
                    card={card}
                    list={list}
                    board={board}
                    closeModal={() => setModal(false)}
            />
        )
        }

        </>
    )
}