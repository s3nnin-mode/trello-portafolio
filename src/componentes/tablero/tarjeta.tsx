import React, { useEffect } from "react";
import '../../styles/tablero/tarjeta.scss';
import { useState } from "react";
import { Modal } from "./modal";
import { BoardProps, ListProps, TargetProps } from "../../types/boardProps";

interface TargetComponentProps {
    target: TargetProps
    board: BoardProps
    list: ListProps
}

export const Target: React.FC<TargetComponentProps> = ({target, board, list}) => {
    const [modal, setModal] = useState<boolean>(false);

    if (!target) {
        return null
    }

    return(
        <>
        <div className='target' onClick={() => setModal(true)} onPointerDown={(e) => e.stopPropagation()}>
            <div className='color_top'></div>
            <div className='content_target'>
                <div className='targets_actives'></div>
                <p>{target.nameTarget}</p>   {/*NOMBRE DE LA TARJETA*/}
                <div className='btns_target'>
                    <button className='btn-target'>Ver</button>
                    <button className='btn-target'>Editar</button>
                    <button className='btn-target'>Eliminar</button>
                </div>
            </div>
        </div>

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