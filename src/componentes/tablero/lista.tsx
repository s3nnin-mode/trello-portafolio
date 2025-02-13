import React, { useEffect, useState } from "react";
import '../../styles/tablero/lista.scss';
//REACT-ICONS
import { RiCollapseHorizontalLine } from "react-icons/ri";
//COMPONENTS
import { SettingsList, useSettingsModalList } from "./settingsList";
import { NameList } from "./list/changeNameList";
import { BtnAdd } from "./btnAgregar";
import { Card } from "./tarjeta";
//DRAG AND DROP
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
//STORES
import { useBoardsStoree } from "../../store/boardsStore";
import { useTargetsStore } from "../../store/targetsStore";
//TYPES
import { BoardProps, ListProps, CardProps } from "../../types/boardProps";

interface ListPropsComponent {
    list: ListProps
    board: BoardProps
}

export const useList = () => {
    const { boards } = useBoardsStoree();
    const { setCard, cardsGroup } = useTargetsStore();

    const addNewCard = ({board, list, nameCard}: { board: BoardProps, list: ListProps, nameCard: string }) => {
        const idList = list.idList;
        const idBoard = board.idBoard;
        
        const newCard: CardProps = {
            idCard: (nameCard + Date.now()).toString(), 
            nameCard: nameCard,
            coverCard: 'grey',
            coverCardImgs: [],
            currentCoverType: 'color'
        };
        setCard({idBoard, idList, newCard}); 
    }

    return { addNewCard, boards, cardsGroup };
}

export const List: React.FC<ListPropsComponent> = ({ board, list }) => {               
    const { addNewCard, cardsGroup } = useList();
    const [isListCollapse, setIsListCollapse] = useState(false);
    const [currentCards, setCurrentCards] = useState<CardProps[]>([]);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: list.idList});
    const style = { transform: CSS.Transform.toString(transform), transition, backgroundColor: list.colorList }
    
    useEffect(() => {
        const indexCardGroup = cardsGroup.findIndex((targetGroup) => targetGroup.idBoard === board.idBoard && targetGroup.idList === list.idList);
        if (indexCardGroup > -1) {
            setCurrentCards(cardsGroup[indexCardGroup].cards);
        }
    }, [cardsGroup]);

    if (!list || !currentCards) {
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
                    currentCards.map((card, index) => (
                        <Card 
                            card={card}
                            board={board}
                            list={list}
                            key={card.idCard}
                        />
                    ))
                }
            </div>
            <footer>
                {
                    list && (
                        <BtnAdd 
                        className='form_add_target'
                        createListOrTargetName={(nameCard: string) => addNewCard({board, list, nameCard})} 
                        nameComponentToAdd='target' 
                        />
                    )
                }
            </footer>
        </div>
    )
}