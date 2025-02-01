import React, { useEffect } from "react";
import '../../styles/tablero/lista.scss';
import { AiOutlinePlus } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

import { RiCollapseHorizontalLine } from "react-icons/ri";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { BtnAdd } from "./btnAgregar";
import { Target } from "./tarjeta";

import { useState } from "react";
import { SettingsList } from "./settingsList";
import { useBoardsStore } from "../../store/boardsStore";
import { ListProps } from "../../types/boardProps";
import { NameList } from "./list/changeNameList";

interface ListPropsComponent {
    idBoard: string
    idList: string
}

const useList = () => {
    const { boards, setTarget } = useBoardsStore();

    const addNewTarget = ({idBoard, idList, nameTarget}: { idBoard: string, idList: string, nameTarget: string }) => {
        const newTarget = {
            idTarget: (nameTarget + Date.now()).toString(),
            nameTarget: nameTarget, 
            tags: [
                {color: 'red', active: false, nameTag: 'tag1'}, 
                {color: 'blue', active: false, nameTag: 'tag2'}, 
                {color: 'green', active: false, nameTag: 'tag3'}
            ]
        };
        setTarget({idBoard, idList, newTarget});        
    }

    const changeNameList = (newName: string) => {

    }

    return { addNewTarget, changeNameList, boards };
}

export const List: React.FC<ListPropsComponent> = ({ idBoard, idList }) => {
    const { addNewTarget, changeNameList, boards } = useList();
    const [isListCollapse, setIsListCollapse] = useState(false);
    const [list, setList] = useState<ListProps>();


    useEffect(() => {
        const indexBoard = boards.findIndex(board => board.idBoard === idBoard);

        if (indexBoard > -1) {
            const indexList = boards[indexBoard].lists.findIndex(list => list.idList === idList);
            if (indexList > -1) {
                const list = boards[indexBoard].lists[indexList]
                setList(list);
            }
        }
    }, []);

    if (!list) {
        return null
    }


    return (
        <div className={isListCollapse ? 'board_list_collapse' : 'board_list'} style={{backgroundColor: list.colorList}}>    {/* COLOR LIST */}
            <header className='header_list'>
                <NameList idBoard={idBoard} list={list} />                     {/* NAMELIST */}
                <div className='btns_header_list'>
                    <button className='btn_collapse_list' onClick={() => setIsListCollapse(!isListCollapse)}>
                        <RiCollapseHorizontalLine className='icon_collapse_list' />
                    </button>
                    <SettingsList idBoard={idBoard} idList={idList} list={list}/>
                </div>
            </header>
            <div className='content_list'>
                {
                    list.targets.map((target, index) => {
                        const indexBoard = boards.findIndex(board => board.idBoard === idBoard);

                        return <Target 
                        nameTarget={target.nameTarget} 
                        tags={target.tags}

                        nameList={list.nameList} 
                        nameBoard={boards[indexBoard].nameBoard}
                        
                        key={target.nameTarget}
                        />
                    })
                }
            </div>
            <footer>
                <BtnAdd 
                    createListOrTargetName={(nameTarget: string) => addNewTarget({idBoard, idList, nameTarget})} 
                    btnName='target' 
                    className='container_btn_add_target' 
                />
            </footer>
        </div>
    )
}