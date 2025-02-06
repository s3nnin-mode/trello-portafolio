import React, { useEffect, useState } from "react";
import '../../styles/tablero/lista.scss';
//REACT-ICONS
import { RiCollapseHorizontalLine } from "react-icons/ri";
//COMPONENTS
import { SettingsList } from "./settingsList";
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
import { ListProps, TargetProps } from "../../types/boardProps";

interface ListPropsComponent {
    idBoard: string
    list: ListProps
}

const useList = () => {
    const { boards } = useBoardsStoree();
    const { setTarget, targetsGroup } = useTargetsStore();

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

    return { addNewTarget, boards, targetsGroup };
}

export const List: React.FC<ListPropsComponent> = ({ idBoard, list }) => {               
    const { addNewTarget, boards, targetsGroup } = useList();
    const [isListCollapse, setIsListCollapse] = useState(false);
    const idList = list.idList;

    const [currentTargets, setCurrentTargets] = useState<TargetProps[]>([])
 
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: list.idList});
    const style = { 
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: list.colorList
    }

    useEffect(() => {
        const indexTargets = targetsGroup.findIndex((targetGroup) => targetGroup.idBoard === idBoard && targetGroup.idList === idList);
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
        style={style} >    {/* COLOR LIST */}
            <header className='header_list'>
                <NameList idBoard={idBoard} list={list} />                     {/* NAMELIST */}
                <div className='btns_header_list'>
                    <button className='btn_collapse_list' onClick={() => setIsListCollapse(!isListCollapse)}>
                        <RiCollapseHorizontalLine className='icon_collapse_list' />
                    </button>
                    <SettingsList idBoard={idBoard} list={list} />
                </div>
            </header>
            <div className='content_list'>
                {
                    currentTargets.map((target, index) => {
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
                {
                    list && (
                        <BtnAdd 
                        createListOrTargetName={(nameTarget: string) => addNewTarget({idBoard, idList, nameTarget})} 
                        btnName='target' 
                        className='container_btn_add_target' 
                        />
                    )
                }
            </footer>
        </div>
    )
}