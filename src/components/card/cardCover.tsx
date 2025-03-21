import { useEffect } from "react"
import { useAuthContext } from "../../customHooks/useAuthContext"
import { useCardsServices } from "../../services/cardsServices"
// import { updateCompleteCard } from "../../services/firebase/updateData/updateCards"
import { CardProps, ListProps } from "../../types/boardProps"
// import { CheckAnimation } from "../animations/checked"

interface CardCoverProps {
    idBoard: string
    list: ListProps
    card: CardProps
    isPlaying: boolean
}

export const CardCover: React.FC<CardCoverProps> = ({idBoard, list, card, isPlaying}) => {
  const { cardsServices } = useCardsServices();
  const { userAuth } = useAuthContext();
  useEffect(() => {
    console.log(idBoard, list, isPlaying, userAuth, cardsServices)
  }, [])
    
  // const cardComplete = (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     const idCard = card.idCard;
  //     if (userAuth) {
  //         updateCompleteCard({
  //             idBoard,
  //             idList: list.idList,
  //             idCard: card.idCard,
  //             complete: !card.complete
  //         });
  //     }

  //     cardsServices({
  //         updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
  //             cardGroup.idBoard === idBoard && cardGroup.idList === list.idList
  //             ?
  //             {
  //                 ...cardGroup,
  //                 cards: cardGroup.cards.map((card) =>
  //                     card.idCard === idCard
  //                     ?
  //                     {
  //                         ...card,
  //                         complete: !card.complete
  //                     }
  //                     :
  //                     card
  //                 )
  //             }
  //             :
  //             cardGroup
  //         )
  //     })
  // }

  return (
  <div className='card_cover'>
      {/* Para el color */}
      <div className='container_color_card'>  
        {
          card.currentCoverType === 'color' && (
            <>
          <span 
            className='circle' 
            style={{background: card.coverCard}}
          />
          <span 
            className='circle' 
            style={{background: card.coverCard}}
          />
          </>
          )
        }
      </div>

      {/* Nombre de la tarjeta */}
      {/* <div className='container_cardName'> */}
      <p className='cardName roboto_light'>
        {card.nameCard}
      </p>
    {/* </div> */}

  </div>
  )
}

 {/* {
      card.currentCoverType === 'color' ?
        <div 
        style={{
          backgroundColor: card.coverCard
        }}
        className='color_bg'>
          {
            card.complete ?
            <span onClick={cardComplete}>Completado</span> :
            <CheckAnimation
              handleClick={cardComplete}
              isPlaying={isPlaying}
              className='check_animation_card' 
            />
          }
        </div> 
      :
      <img src={card.coverCard} />
    } */}