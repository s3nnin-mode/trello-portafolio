import { create } from "zustand";
import { CardGroupProps } from "../types/boardProps";

interface State {
    cardsGroup: CardGroupProps[]
    loadCards: (cards: CardGroupProps[]) => void
    // setCardsGroup: (props: {idBoard: string, idList: string, cards: CardProps[]}) => void      //setTargetGroup es para inicializar un objeto con un idBoard, idList para saber a que board y list pertenece, se incializa con un array vacio
    // setCard: ({idBoard, idList, newCard} : {idBoard: string, idList: string, newCard: CardProps}) => void
    // setCardToTop: ({idBoard, idList, cardToAdd}: {idBoard: string, idList: string, cardToAdd: CardProps}) => void
    // setCoverCard: ({idBoard, idList, idCard, cover, coverType} : {idBoard: string, idList: string, idCard: string, cover: string, coverType: 'color' | 'img'}) => void
    setCoverCardImg: ({idBoard, idList, idCard, img} : {idBoard: string, idList: string, idCard: string, img: string}) => void
}

export const useCardsStore = create<State>((set) => ({
    cardsGroup: [],
    loadCards: (cards) => set(() => ({
        cardsGroup: cards
    })),
    setCoverCardImg: ({ idBoard, idList, idCard, img }) => set((state) => ({
        cardsGroup: state.cardsGroup.map((cardGroup) =>
            cardGroup.idBoard === idBoard && cardGroup.idList === idList ?
            { 
                ...cardGroup, cards: cardGroup.cards.map((card) => 
                card.idCard === idCard ?
                    { 
                        ...card, 
                        coverCardImgs: [...card.coverCardImgs, img]
                    } 
                    :
                card
            )}
            :
            cardGroup
        )
    })),
}));

// setCardsGroup: ({idBoard, idList, cards}) => set((state) => ({
//     cardsGroup: [...state.cardsGroup, { idBoard: idBoard, idList: idList, cards: cards }]
// })),
// setCard: ({idBoard, idList, newCard}) => set((state) => ({
//     cardsGroup: state.cardsGroup.map((cardGroup) => 
//         cardGroup.idBoard === idBoard && cardGroup.idList === idList
//     ?
//     {
//         ...cardGroup,
//         cards: [...cardGroup.cards, newCard]
//     }
//     :
//     cardGroup
//     )
// })),
// setCoverCard: ({idBoard, idList, idCard, cover, coverType}) => set((state) => ({
//     cardsGroup: state.cardsGroup.map((cardGroup) => 
//         cardGroup.idBoard === idBoard && cardGroup.idList === idList ?
//             {   ...cardGroup,
//                 cards: cardGroup.cards.map((card) => 
//                     card.idCard === idCard ?
//                     { 
//                         ...card, 
//                         currentCoverType: coverType,
//                         coverCard: cover
//                     } :
//                     card
//                 )
//             }
//         :
//         cardGroup
//     )
// })),
// setCoverCardImg: ({ idBoard, idList, idCard, img }) => set((state) => ({
//     cardsGroup: state.cardsGroup.map((cardGroup) =>
//         cardGroup.idBoard === idBoard && cardGroup.idList === idList ?
//         { 
//             ...cardGroup, cards: cardGroup.cards.map((card) => 
//             card.idCard === idCard ?
//                 { 
//                     ...card, 
//                     coverCardImgs: [...card.coverCardImgs, img]
//                 } 
//                 :
//             card
//         )}
//         :
//         cardGroup
//     )
// })),
// setCardToTop: ({idBoard, idList, cardToAdd}) => set((state) => ({
//     cardsGroup: state.cardsGroup.map((cardGroup) => 
//         cardGroup.idBoard === idBoard && cardGroup.idList === idList ?
//             {
//                 ...cardGroup,
//                 cards: [cardToAdd, ...cardGroup.cards]
//             }
//         :
//             cardGroup
//     )
// })),