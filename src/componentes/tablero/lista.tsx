import React from "react";
import '../../styles/tablero/lista.scss';
import { AiOutlinePlus } from "react-icons/ai";
import { RiCollapseHorizontalLine } from "react-icons/ri";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { BtnAdd } from "./btnAgregar";
import { Target } from "./tarjeta";

import { useState } from "react";

interface ListProps {
    nameList: string
}

interface TargetProps {
    nameTarget: string
    nameList: string
    tags: {color: string, active: boolean, name: string}[];
}

export const List: React.FC<ListProps> = ({ nameList }) => {
    const [targets, setTargets] = useState<TargetProps[]>([]);

    const createTarget = (name: string) => {
        const newTarget = {
            nameTarget: name, 
            nameList: nameList, 
            tags: [
                {color: 'red', active: false, name: 'tag1'}, 
                {color: 'blue', active: false, name: 'tag2'}, 
                {color: 'green', active: false, name: 'tag3'}
            ]
        };
        setTargets([...targets, newTarget]);
    }

    return (
        <div className='board_list' id={nameList}>
            <header>
                <p className='title_list'>{nameList}</p>
                <div className='btns_header_list'>
                    <button className='btn_collapse_list'>
                        <RiCollapseHorizontalLine className='icon_collapse_list' />
                    </button>
                    <button className='options'>
                        <PiDotsThreeOutlineFill className='icon_options_list' />
                    </button>
                </div>
            </header>
            <div className='content-list'>
                {
                    targets.map((target) => (
                        <Target 
                        nameTarget={target.nameTarget} 
                        nameList={target.nameList} 
                        tags={target.tags}
                        key={target.nameTarget} />
                    ))
                }
            </div>
            <footer>
                <BtnAdd createListOrTargetName={createTarget} btnName='target'/>
            </footer>
        </div>
    )
}