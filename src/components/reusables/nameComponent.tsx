import { useEffect, useState } from "react";
import '../../styles/components/reusables/nameComponent.scss';
import { CardProps, ListProps } from "../../types/boardProps";
import { useListsServices } from "../../services/listsServices";
import { useCardsServices } from "../../services/cardsServices";

interface NameListPropsComponent {
    idBoard: string
    list: ListProps
    card?: CardProps
    componentType: 'list' | 'card'
    className?: string
}

export const NameComponent: React.FC<NameListPropsComponent> = ({idBoard, list, card, componentType, className}) => {
    const { listsService } = useListsServices();
    const { cardsServices } = useCardsServices();
    const [isOpenInput, setIsOpenInput] = useState(false);
    const [nameComponent, setNameComponent] = useState('');

    useEffect(() => {
        if (componentType === 'list') {
            setNameComponent(list.nameList);
        } else if (componentType === 'card') {
            if (!card) return
            setNameComponent(card.nameCard);
        }
    }, []);

    const handleChangeList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const idList = list.idList;
        setNameComponent(e.target.value); 

        listsService({
            updateFn: (listsGroup) => listsGroup.map((listGroup) => 
                listGroup.idBoard === idBoard
                ?
                {   ...listGroup,
                    lists: listGroup.lists.map((list) => 
                        list.idList === idList ? 
                        { ...list, nameList: e.target.value } 
                        : 
                        list
                    )
                }
                :
                listGroup
            )
        });
    }

    const handleChangeCard = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const idCard = card?.idCard;
        setNameComponent(e.target.value);
        cardsServices({
            updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
            cardGroup.idBoard === idBoard && cardGroup.idList === list.idList ?
            { 
                ...cardGroup, cards: cardGroup.cards.map((card) => 
                card.idCard === idCard ? 
                {...card, nameCard: e.target.value}
                :
                card
                )
            }
            :
            cardGroup
            )
        })
    }

    const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        target.style.height = "auto"; 
        target.style.height = `${target.scrollHeight}px`;
    }

    const actions = {
        list: handleChangeList,
        card: handleChangeCard
    }

    return (
        <div className={`title_component ${className}`} onPointerDown={(e) => e.stopPropagation()}>
            <h3 className='name_component'                                         //abrir input
             style={{display: isOpenInput ? 'none' : 'block'}}
             onClick={() => setIsOpenInput(true)}
             onPointerDown={(e) => e.stopPropagation()}
             >        
                {nameComponent}
            </h3>

            {isOpenInput && (
                <textarea
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{overflow: "hidden", resize: "none"}}
                    onInput={onInput}
                    value={nameComponent}
                    onChange={actions[componentType]} 
                    onBlur={() => setIsOpenInput(false)} // Ocultar textarea al perder el foco 
                />
            )}
        </div> 
    )
}