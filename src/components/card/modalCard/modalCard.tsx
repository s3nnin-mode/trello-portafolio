import { useEffect, useState } from "react";
import '../../../styles/components/card/modalCard/modalCard.scss';
import { BoardProps, ListProps, TagsProps, CardProps } from '../../../types/boardProps';
import { useTagsStore } from "../../../store/tagsStore";
//COMPONENTS
import { Tags } from "./modalComponents/tags/tags";
import { CardModalCover } from "./modalComponents/cover/cardModalCover";
import { BtnOpenTags } from "./modalComponents/btnOpenTags/btnOpenTags";
import { TitleModalCard } from "./modalComponents/titleModalCard";
import { BtnRemoveCard } from "./modalComponents/btnOpenTags/btnRemoveCard";

interface ModalTargetComponentProps {
    card: CardProps
    list: ListProps
    board: BoardProps
    closeModal: () => void
}

interface Tags {           //puedes
    idTag: string
    nameTag: string
    color: string 
}

export const Modal: React.FC<ModalTargetComponentProps> = ({ card, list, board, closeModal }) => {
    const { tags } = useTagsStore();
    const [currentActiveTags, setCurrentActiveTags] = useState<Tags[]>([]);
    const [showTags, setShowTags] = useState(false);

    useEffect(() => {
        const activeTags: TagsProps[] = [];

        tags.map((tag) => 
            tag.cardsThatUseIt.some((c) => 
            (c.idBoard === board.idBoard && c.idList === list.idList && c.idCard === card.idCard) ?
            activeTags.push(tag) : 
            null
            )
        )

        setCurrentActiveTags(activeTags);
    }, [tags]);

    return (
        <div className='modal_show' onPointerDown={(e) => e.stopPropagation()}>
            <CardModalCover 
                card={card}
                idBoard={board.idBoard}
                idList={list.idList} 
                closeModal={closeModal} 
            />

            <div className='sidebar_modal'>             {/*SIDEBAR*/}
                <BtnOpenTags board={board} list={list} card={card} />
                <button className='btn_modal_sidebar'>Editar</button>
                <BtnRemoveCard idBoard={board.idBoard} list={list} card={card} />
            </div>

            <TitleModalCard board={board} list={list} card={card} />
            
            <div className='modal_content_container'>         {/*CONTENIDO*/}
                <div className='modal_content'>
                    <div className='tags_container'>
                        <h4>Etiquetas activas</h4>
                        {
                            currentActiveTags.length > 0 
                            ?
                            (
                                <div className='tags'>           {/* PUEDES Y DEBES SEPARAR EL COMPONENTE DE ETIQUETAS PARA QUE ESTÉ MAS LIMPIO */}
                                {
                                    currentActiveTags.map((tag) => <button key={tag.idTag} style={{backgroundColor: tag.color}} className='tag_active'>{tag.nameTag}</button>)
                                }
                                    <button className='btn_add_tag' onClick={() => setShowTags(true)}>+</button>  {/*PARA ACTIVAR EL MODAL*/}
                            
                                </div>
                            )
                            :
                            <>
                                <span style={{fontStyle: 'italic'}}>No hay etiquetas para esta tarjeta..</span>
                                <button className='btn_add_tag' onClick={() => setShowTags(true)}>+</button>             {/*PARA ACTIVAR EL MODAL*/}
                            </>

                        }
                        
                    </div>                   
                </div>

                 
            </div>

            {
                showTags && (
                    <Tags 
                    board={board} 
                    list={list} 
                    card={card} 
                    closeTagsSettings={() => setShowTags(false)} />
                )
            }
        </div>
    )
}