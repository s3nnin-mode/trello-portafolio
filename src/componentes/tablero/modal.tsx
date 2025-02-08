import { useEffect, useState } from "react";
import '../../styles/tablero/modal.scss';
import { TagSettings } from "./modalComp/tagsSettings";
import { BoardProps, ListProps, TargetProps } from "../../types/boardProps";

interface TagsProps {
    color: string
    active: boolean
    nameTag: string
}

interface ModalTargetComponentProps {
    target: TargetProps
    list: ListProps
    board: BoardProps
}

export const Modal: React.FC<ModalTargetComponentProps> = ({ target, list, board }) => {

    const [myTags, setMyTags] = useState<TagsProps[]>([]);
    const [showTags, setShowTags] = useState(false);

    useEffect(() => {
        setMyTags(target.tags);
    });

    return (
        <div className='modal_show' onPointerDown={(e) => e.stopPropagation()}>
            <header className='header_modal_target'>
                <div>
                    <h4>Target: {target.nameTarget}</h4>
                    <p>en la lista {list.nameList}</p>
                </div>
                <button>X</button>
            </header>
            <div className='modal_content_container'>         {/*CONTENIDO*/}
                <div className='modal_content'>
                    <div className='tags_container'>
                        <h3>Tags</h3>
                        <div className='tags'>
                            {
                                myTags.map((tag) => {
                                    return tag.active ? <button key={tag.nameTag} style={{backgroundColor: tag.color}}>{tag.nameTag}</button> : ''
                                })
                            }
                            <button className='btn_add_tag' onClick={() => setShowTags(true)}>+</button>
                            {
                                showTags && (
                                    <TagSettings 
                                    board={board} 
                                    list={list} 
                                    target={target} 
                                    closeTagsSettings={() => setShowTags(false)} />
                                    )
                            }
                        </div>
                    </div>                   
                </div>

                <div className='sidebar_modal'>             {/*SIDEBAR*/}
                    <button>Tags</button>
                    <button>Editar</button>
                    <button>Eliminar</button>
                </div> 
            </div>
        </div>
    )
}