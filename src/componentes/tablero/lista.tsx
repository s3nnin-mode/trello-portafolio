import React, { useEffect, useState } from "react";
import '../../styles/tablero/lista.scss';
//REACT-ICONS
import { RiCollapseHorizontalLine } from "react-icons/ri";
//COMPONENTS
import { SettingsList, useSettingsModalList } from "./settingsList";
import { NameList } from "./list/changeNameList";
import { BtnAdd } from "./btnAgregar";
import { Target } from "./tarjeta";
//DRAG AND DROP
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
//STORES
import { useBoardsStoree } from "../../store/boardsStoredos";
import { useTargetsStore } from "../../store/targetsStore";
//TYPES
import { BoardProps, ListProps, TargetProps } from "../../types/boardProps";

interface ListPropsComponent {
    list: ListProps
    board: BoardProps
}

export const useList = () => {
    const { boards } = useBoardsStoree();
    const { setTarget, targetsGroup } = useTargetsStore();

    const addNewTarget = ({board, list, nameTarget}: { board: BoardProps, list: ListProps, nameTarget: string }) => {
        const idList = list.idList;
        const idBoard = board.idBoard;
        
        const newTarget = {
            idTarget: (nameTarget + Date.now()).toString(),
            nameTarget: nameTarget, 
            tags: [
                {color: 'red', active: false, nameTag: 'tag1'}, 
                {color: 'blue', active: true, nameTag: 'tag2'}, 
                {color: 'green', active: false, nameTag: 'tag3'}
            ]
        };
        setTarget({idBoard, idList, newTarget});      
    }

    return { addNewTarget, boards, targetsGroup };
}

export const List: React.FC<ListPropsComponent> = ({ board, list }) => {               
    const { addNewTarget, boards, targetsGroup } = useList();
    const [isListCollapse, setIsListCollapse] = useState(false);
    const [currentTargets, setCurrentTargets] = useState<TargetProps[]>([]);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: list.idList});
    const style = { 
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: list.colorList
    }

    useEffect(() => {
        const indexTargets = targetsGroup.findIndex((targetGroup) => targetGroup.idBoard === board.idBoard && targetGroup.idList === list.idList);
        if (indexTargets > -1) {
            setCurrentTargets(targetsGroup[indexTargets].targets);
        }
    }, [targetsGroup]);

    if (!list || !currentTargets) {
        return null
    }

    return (
        <div 
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={isListCollapse ? 'board_list_collapse' : 'board_list'} 
            style={style} 
        >    
            <header className='header_list'>
                <NameList idBoard={board.idBoard} list={list} />                     {/* NAMELIST */}
                <div className='btns_header_list'>
                    <button className='btn_collapse_list' onClick={() => setIsListCollapse(!isListCollapse)}>
                        <RiCollapseHorizontalLine className='icon_collapse_list' />
                    </button>
                    <SettingsList idBoard={board.idBoard} list={list} />
                </div>
            </header>
            <div className='content_list'>
                
                {
                    currentTargets.map((target, index) => (
                        <Target 
                            target={target}
                            board={board}
                            list={list}
                            key={target.idTarget}
                        />
                    ))
                }
            </div>
            <footer>
                {
                    list && (
                        <BtnAdd 
                        className='form_add_target'
                        createListOrTargetName={(nameTarget: string) => addNewTarget({board, list, nameTarget})} 
                        nameComponentToAdd='target' 
                        />
                    )
                }
            </footer>
        </div>
    )
}