import React, { useRef } from "react";
import '../../styles/components/card/card.scss';
import { useState } from "react";
import { Modal } from "./modalCard/modalCard";
import { BoardProps, ListProps, TagsProps, CardProps } from '../../types/boardProps';
import { useTagsStore } from "../../store/tagsStore";
import { CardCover } from "./cardCover";
import { SettingsList } from "../list/optionsList/settingsList";

interface TargetComponentProps {
    card: CardProps
    board: BoardProps
    list: ListProps
}

export const Card: React.FC<TargetComponentProps> = ({card, board, list}) => {
    const { tags } = useTagsStore();
    const [modal, setModal] = useState<boolean>(false);

    if (!card) {
        return null
    }

    const isActive = ({tag}: {tag: TagsProps}) => {
        return tag.cardsThatUseIt.some((t) =>
                t.idBoard === board.idBoard && 
                t.idList === list.idList && 
                t.idCard === card.idCard 
                ?
                true :
                false
            )
    }

    const [isPlaying, setIsPlaying] = useState(false);

    return(
        <>
        <article 
            onMouseEnter={(e) => {e.stopPropagation(); setIsPlaying(true)}}
            onMouseLeave={(e) => {e.stopPropagation(); setIsPlaying(false)}}
            className='target' 
            onClick={() => setModal(true)} 
            onPointerDown={(e) => e.stopPropagation()}
            >
            <CardCover idBoard={board.idBoard} list={list} card={card} isPlaying={isPlaying} />

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