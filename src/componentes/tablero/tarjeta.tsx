import React, { useEffect } from "react";
import '../../styles/tablero/tarjeta.scss';
import { useState } from "react";
import { Modal } from "./modal";
import { BoardProps, ListProps, TagsProps, TargetProps } from "../../types/boardProps";
import { useTagsStore } from "../../store/tagsStore";

interface TargetComponentProps {
    target: TargetProps
    board: BoardProps
    list: ListProps
}

export const Target: React.FC<TargetComponentProps> = ({target, board, list}) => {
    const { tags } = useTagsStore();
    const [modal, setModal] = useState<boolean>(false);

    useEffect(() => {
        console.log('img en target: ', target.coverCard)
        console.log('files', target.coverCardImgs)
    }, [])

    if (!target) {
        return null
    }

    const isActive = ({tag}: {tag: TagsProps}) => {
        return tag.targetsThatUseIt.some((t) =>
                t.idBoard === board.idBoard && t.idList === list.idList && t.idTarget === target.idTarget ?
                true :
                false
            )
    }

    return(
        <>
        <article className='target' onClick={() => setModal(true)} onPointerDown={(e) => e.stopPropagation()}>
            {
                target.currentCoverType === 'color' ?
                <div 
                    style={{backgroundColor: target.currentCoverType === 'color' ? target.coverCard : ''}}
                    className='color_top' /> 
                :
                <img src={target.coverCard} />
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
                <p className='name_target'>{target.nameTarget}</p>   {/*NOMBRE DE LA TARJETA*/}
                <div className='btns_target'>
                    {/* <button className='btn-target'>Ver</button>
                    <button className='btn-target'>Editar</button>
                    <button className='btn-target'>Eliminar</button> */}
                </div>
            </div>
        </article>

        {/* <!-- Modal --> */}

        {modal && (
            <Modal 
                target={target}
                list={list}
                board={board}
                closeModal={() => setModal(false)}
            />
        )
        }

        </>
    )
}

{/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button> */}

{/* <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className="modal-dialog">
    <div className="modal-content">
    <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Targeta: {name}</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div className="modal-body">
        <p>Modal body text goes here.</p>
    </div>
    <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
    </div>
    </div>
</div>
</div> */}

{/* <div className={`modal_${modal ? 'show' : 'hidden'}`}>
            <header>
                <div>
                    <h2>Target: {nameTarget}</h2>
                    <p>en la lista {nameList}</p>
                </div>
                <button onClick={() => setModal(false)}>X</button>
            </header>
            <div className='modal_content_container'>
                <div className='modal_content'>
                    COntent                     
                </div>
                <div className='sidebar_modal'>
                        <button onClick={() => setTags(true)}>Tags</button>
                        <button>Editar</button>
                        <button>Eliminar</button>
                </div> 
            </div>
            
        </div> */}