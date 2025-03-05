import '../../../../styles/components/card/modalCard/modalComponents/cardDescription.scss';
import { MdDescription } from "react-icons/md";
import { CardProps } from "../../../../types/boardProps";
import React, { useEffect, useState } from "react";
import { useCardsServices } from "../../../../services/cardsServices";
import { useAuthContext } from '../../../../customHooks/useAuthContext';
import { updateDescriptionCard } from '../../../../services/firebase/updateData/updateCards';

interface CardDescriptionProps {
    card: CardProps
    idBoard: string
    idList: string
}

export const CardDescription: React.FC<CardDescriptionProps> = ({card, idList, idBoard}) => {
    const { cardsServices } = useCardsServices();
    const [showTextarea, setShowTextarea] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { userAuth } = useAuthContext();

    useEffect(() => {
        if (card.description) {
            setInputValue(card.description);
        }
    }, []);

    const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        target.style.height = "auto"; 
        target.style.height = `${target.scrollHeight}px`;
    }

    const saveDescription = () => {
        const idCard = card.idCard;
        if (userAuth) {
            updateDescriptionCard({
                idBoard, 
                idList, 
                idCard, 
                description: inputValue
            })
        }
        cardsServices({
            updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
            cardGroup.idBoard === idBoard && cardGroup.idList === idList ?
            {
                ...cardGroup,
                cards: cardGroup.cards.map((card) =>
                card.idCard === idCard ?
                {
                    ...card,
                    description: inputValue === '' ? null : inputValue
                }
                :
                card
                ) 
            }
            :
            cardGroup
            )
        });
        setShowTextarea(false);
    }
    
    return (
    <div className='container_card_description_modal'>
        <button className='btn_open_textarea' onClick={() => setShowTextarea(!showTextarea)}>
            <MdDescription className='icon_description_card_modal'/>
        </button>
        {
            !showTextarea && (
                card.description !== null ?
                <span>{card.description}</span> :
                <span style={{fontStyle: 'italic'}}>Sin descripcion...</span>
            )
        }
        {
            showTextarea && (
                <form>
                    <textarea
                    onKeyDown={(e) => e.stopPropagation()} 
                    onInput={onInput}
                    value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        <div>
                            <button type='button' onClick={saveDescription}>Guardar</button>
                            <button type='button' onClick={() => setShowTextarea(false)}>Cancelar</button>
                        </div>
                </form>
            )
        }
    </div>
    )
}