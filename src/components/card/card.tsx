import React from "react";
import '../../styles/components/card/card.scss';
import { useState } from "react";
import { CardModal } from "./modalCard/modalCard";
import { BoardProps, ListProps, TagsProps, CardProps } from '../../types/boardProps';
import { useTagsStore } from "../../store/tagsStore";
import { CardCover } from "./cardCover";
import { MdDescription } from "react-icons/md";

interface TargetComponentProps {
    card: CardProps
    board: BoardProps
    list: ListProps
}

export const Card: React.FC<TargetComponentProps> = ({card, board, list}) => {
    const { tags } = useTagsStore();
    const [showCardModal, setShowCardModal] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState(false);

    if (!card) {
        return null
    }

    const isActive = ({tag}: {tag: TagsProps}) => {
        return tag.cardsThatUseIt.some((t) =>
            t.idBoard === board.idBoard && 
            t.idList === list.idList && 
            t.idCard === card.idCard 
        )
    }

    return(
        <>
        <article 
            onMouseEnter={(e) => {e.stopPropagation(); setIsPlaying(true)}}
            onMouseLeave={(e) => {e.stopPropagation(); setIsPlaying(false)}}
            className='target' 
            onClick={() => setShowCardModal(true)} 
            onPointerDown={(e) => e.stopPropagation()}
            >
            <CardCover idBoard={board.idBoard} list={list} card={card} isPlaying={isPlaying} />

            <div className='content_target'>
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

        {/* <!-- Modal --> */}

        {
            showCardModal && (
                <CardModal 
                    card={card}
                    list={list}
                    board={board}
                    closeModal={() => setShowCardModal(false)}
            />
        )
        }

        </>
    )
}