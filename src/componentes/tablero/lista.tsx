import React from "react";
import '../../styles/tablero/lista.scss';
import { AiOutlinePlus } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

import { RiCollapseHorizontalLine } from "react-icons/ri";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { BtnAdd } from "./btnAgregar";
import { Target } from "./tarjeta";

import { useState } from "react";
import { useBoards } from "../rutas/tableros";
import { TargetProps } from "../../types/boardProps";

interface ListProps {
    nameList: string
    board: string
    targets: TargetProps[]
    indexList: number
    indexBoard: number
}

const useList = () => {
    const { boards, setBoards } = useBoards();

    const addNewTarget = ({nameTarget, indexBoard, indexList}: { nameTarget: string, indexBoard: number, indexList: number }) => {
        const newTarget = {
            nameTarget: nameTarget, 
            tags: [
                {color: 'red', active: false, nameTag: 'tag1'}, 
                {color: 'blue', active: false, nameTag: 'tag2'}, 
                {color: 'green', active: false, nameTag: 'tag3'}
            ]
        };
        const BOARDS = [...boards];
        BOARDS[indexBoard].lists[indexList].targets = [...BOARDS[indexBoard].lists[indexList].targets, newTarget];
        setBoards(BOARDS);
        localStorage.setItem('boards', JSON.stringify(BOARDS));
        console.log(`Se agregó la tarjeta ${nameTarget} en la lista ${BOARDS[indexBoard].lists[indexList]} correctamente`);
        console.log('update', BOARDS)
    }

    const deleteList = ({indexBoard, indexList}: {indexBoard: number, indexList: number}) => {
        const BOARDS = [...boards];
        BOARDS[indexBoard].lists = BOARDS[indexBoard].lists.filter((list, index) => index !== indexList);
        localStorage.setItem('boards', JSON.stringify(BOARDS));
        setBoards(BOARDS);        
    }
    return { addNewTarget, deleteList };
}

export const List: React.FC<ListProps> = ({ nameList, board, indexList, indexBoard, targets }) => {
    const [isOptionsActive, setIsOptionsActive] = useState(false);
    const { addNewTarget, deleteList } = useList();

    const createTarget = (nameTarget: string) => {        
        addNewTarget({nameTarget, indexBoard, indexList})
    }

    return (
        <div className='board_list' id={nameList}>
            <header className='header_list'>
                <p className='title_list'>{nameList}</p>  {/*NAMELIST */}
                <div className='btns_header_list'>
                    <button className='btn_collapse_list'>
                        <RiCollapseHorizontalLine className='icon_collapse_list' />
                    </button>
                    <div className='options'>
                        <button onClick={() => setIsOptionsActive(true)} className='btn_active_options'>
                            <PiDotsThreeOutlineFill className='icon_options_list' />
                        </button>
                        <div className={`settings_list_${isOptionsActive ? 'show' : 'hidden'}`}>
                            <div className='header_settings_list'>
                                <IoMdClose className='icon-close' onClick={() => setIsOptionsActive(false)} />
                            </div>
                            <button>Cambiar color</button>
                            <button onClick={() => deleteList({indexBoard, indexList})}>Eliminar lista</button>
                        </div>
                    </div>
                </div>
            </header>
            <div className='content-list'>
                {
                    targets.map((target, index) => (
                        <Target 
                        nameTarget={target.nameTarget} 
                        tags={target.tags}

                        nameList={nameList} 
                        nameBoard={board}
                        
                        key={target.nameTarget}
                        />
                    ))
                }
            </div>
            <footer>
                <BtnAdd 
                    createListOrTargetName={createTarget} 
                    btnName='target' 
                    className='container_btn_add_target' 
                />
            </footer>
        </div>
    )
}