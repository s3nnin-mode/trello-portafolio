import { useCardsServices } from "../../services/cardsServices"
import { CardProps, ListProps } from "../../types/boardProps"
import { CheckAnimation } from "../animations/checked"

interface CardCoverProps {
    idBoard: string
    list: ListProps
    card: CardProps
    isPlaying: boolean
}

export const CardCover: React.FC<CardCoverProps> = ({idBoard, list, card, isPlaying}) => {
    const { cardsServices } = useCardsServices();
    
    const cardComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        const idCard = card.idCard;

        cardsServices({
            updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
                cardGroup.idBoard === idBoard && cardGroup.idList === list.idList
                ?
                {
                    ...cardGroup,
                    cards: cardGroup.cards.map((card) =>
                        card.idCard === idCard
                        ?
                        {
                            ...card,
                            complete: !card.complete
                        }
                        :
                        card
                    )
                }
                :
                cardGroup
            )
        })
    }

    return (
        <div className='card_cover'>
            {
                card.currentCoverType === 'color' ?
                <div 
                    style={{backgroundColor: card.currentCoverType === 'color' ? card.coverCard : ''}}
                    className='color_top'>
                        {
                            card.complete ?
                            <span onClick={cardComplete}>Completado</span> :
                            <CheckAnimation
                                handleClick={cardComplete}
                                isPlaying={isPlaying}
                                className='check_animation_card' />
                        }
                    </div> 
                :
                <img src={card.coverCard} />
            }
        </div>
    )
}