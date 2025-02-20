import React, { useEffect, useState } from "react";
import '../../styles/components/list/list.scss';
//REACT-ICONS
import { RiCollapseHorizontalLine } from "react-icons/ri";
//COMPONENTS
import { SettingsList } from "./optionsList/settingsList";
import { NameComponent } from "../reusables/nameComponent";
import { BtnAdd } from "../reusables/btnAgregar";
import { Card } from "../card/card";
//DRAG AND DROP List
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
//STORES
import { useBoardsStore } from "../../store/boardsStore";
import { useCardsStore } from "../../store/cardsStore";
//TYPES
import { BoardProps, ListProps, CardProps } from '../../types/boardProps';
import { useCardsServices } from "../../services/cardsServices";
//DRaG AND DROP CARDS
import { closestCenter, DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';


interface ListPropsComponent {
    list: ListProps
    board: BoardProps
}

export const useList = () => {
    const { cardsServices } = useCardsServices();

    const addNewCard = ({board, list, nameCard}: { board: BoardProps, list: ListProps, nameCard: string }) => {
        const idList = list.idList;
        const idBoard = board.idBoard;
        
        const newCard: CardProps = {
            idCard: (nameCard + Date.now()).toString(), 
            nameCard: nameCard,
            coverCard: 'grey',
            coverCardImgs: [],
            currentCoverType: 'color',
            complete: false,
            description: null
        };
        
        cardsServices({
            updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
                (cardGroup.idBoard === idBoard && cardGroup.idList === idList) 
                ?
                {
                    ...cardGroup,
                    cards: [...cardGroup.cards, newCard]
                }
                :
                cardGroup
                )
        });
    }

    return { addNewCard, cardsServices };
}

export const List: React.FC<ListPropsComponent> = ({ board, list }) => {               
    const { addNewCard, cardsServices } = useList();
    const { cardsGroup } = useCardsStore();
    const [isListCollapse, setIsListCollapse] = useState(false);
    const [currentCards, setCurrentCards] = useState<CardProps[]>([]);

    const { 
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition,
    } = useSortable({
        id: list.idList,
        data: {
            type: 'list',
            list: list,
        }
    });
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        })
    );

    const style = { transform: CSS.Transform.toString(transform), transition, backgroundColor: list.colorList }
    
    useEffect(() => {
        const indexCardGroup = cardsGroup.findIndex((targetGroup) => targetGroup.idBoard === board.idBoard && targetGroup.idList === list.idList);
        if (indexCardGroup > -1) {
            setCurrentCards(cardsGroup[indexCardGroup].cards);
        }
    }, [cardsGroup]);

    const [activeCard, setActiveCard] = useState<CardProps | null>(null);

    const onDragEndCards = (event: DragEndEvent) => {
        // event.activatorEvent?.stopPropagation(); //que hace esta linea? esta linea hace que el evento no se propague a los padres. Y tambien evita que se ejecute el evento de click de

        const {active, over} = event;
        if (!active || !over) return;
        const oldIndex = currentCards.findIndex((card) => card.idCard === active.id);
        const newIndex = currentCards.findIndex((card) => card.idCard === over.id);
        const newCards = arrayMove(currentCards, oldIndex, newIndex);
        const idList = list.idList;
        const idBoard = board.idBoard;
        cardsServices({
            updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
                (cardGroup.idBoard === idBoard && cardGroup.idList === idList) 
                ?
                {
                    ...cardGroup,
                    cards: newCards
                }
                :
                cardGroup
            )})
    }

    const onDragStartCards = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'card') {
            setActiveCard(event.active.data.current.card);
            return;
        }
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={isListCollapse ? 'board_list_collapse' : 'board_list'} 
        >    
            <header 
                {...attributes} //el drag and drop de la lista funcionará solo si se arrastra desde el header
                {...listeners} 
                className='header_list'>  

                <NameComponent idBoard={board.idBoard} list={list} componentType='list' />                     {/* NAMELIST */}
                <div className='btns_header_list'>
                    <button className='btn_collapse_list' onClick={() => setIsListCollapse(!isListCollapse)}>
                        <RiCollapseHorizontalLine className='icon_collapse_list' />
                    </button>
                    <SettingsList idBoard={board.idBoard} list={list} />
                </div>
            </header>
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter} 
                onDragStart={onDragStartCards} 
                onDragEnd={onDragEndCards}>
                <SortableContext items={currentCards.map((card) => card.idCard)} strategy={verticalListSortingStrategy}>
                    <div className='content_list'>
                        {
                            currentCards.map((card) => (
                                <Card 
                                    card={card}
                                    board={board}
                                    list={list}
                                    key={card.idCard}
                                />
                            ))
                        }
                    </div>
                </SortableContext>
            </DndContext>
            <footer onPointerDown={(e) => e.stopPropagation()}>
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