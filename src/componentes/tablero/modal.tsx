import { useEffect, useState } from "react";
import '../../styles/tablero/modal.scss';
import { Tags } from "./modalComp/tags";
import { BoardProps, ListProps, TagsProps, TargetProps } from "../../types/boardProps";
import { useTagsStore } from "../../store/tagsStore";
import { CardModalCover } from "./modalComp/cardModalCover";

interface ModalTargetComponentProps {
    target: TargetProps
    list: ListProps
    board: BoardProps
    closeModal: () => void
}

interface Tags {           //puedes
    idTag: string
    nameTag: string
    color: string 
}

export const Modal: React.FC<ModalTargetComponentProps> = ({ target, list, board, closeModal }) => {
    const { tags } = useTagsStore();
    const [currentActiveTags, setCurrentActiveTags] = useState<Tags[]>([]);
    const [showTags, setShowTags] = useState(false);

    useEffect(() => {
        console.log('TAGS: ', tags)
        const activeTags: TagsProps[] = [];

        tags.map((tag) => 
            tag.targetsThatUseIt.some((t) =>t.idBoard === board.idBoard && t.idList === list.idList && t.idTarget === target.idTarget
            ?
            activeTags.push(tag)
            :
            null
            )
        )

        setCurrentActiveTags(activeTags);
        console.log('current tags: ', activeTags)
    }, [tags]);

    return (
        <div className='modal_show' onPointerDown={(e) => e.stopPropagation()}>
            <CardModalCover 
                card={target}
                idBoard={board.idBoard}
                idList={list.idList} 
                closeModal={closeModal} 
            />

            <article className='name_card_container'>
                <h3>Target: {target.nameTarget}</h3>
                <p>en la lista {list.nameList}</p>
            </article>
            
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
                                <button className='btn_add_tag' onClick={() => setShowTags(true)}>+</button>  {/*PARA ACTIVAR EL MODAL*/}
                            </>

                        }
                        
                    </div>                   
                </div>

                <div className='sidebar_modal'>             {/*SIDEBAR*/}
                    <button>Tags</button>
                    <button>Editar</button>
                    <button>Eliminar</button>
                </div> 
            </div>

            {
                showTags && (
                    <Tags 
                    board={board} 
                    list={list} 
                    target={target} 
                    closeTagsSettings={() => setShowTags(false)} />
                )
            }
        </div>
    )
}