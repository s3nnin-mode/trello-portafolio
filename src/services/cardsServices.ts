import { useAuthContext } from "../customHooks/useAuthContext"
import { useCardsStore } from "../store/cardsStore"
import { CardGroupProps, CardProps } from "../types/boardProps"

export const useCardsServices = () => {
    const { userAuth } = useAuthContext();

    const cardsServices = ({updateFn}: 
    {
        updateFn: (cardsGroups: CardGroupProps[]) => CardGroupProps[]
    }) => {
        useCardsStore.setState((state) => ({
            cardsGroup: updateFn(state.cardsGroup)
        }));

        if (userAuth) {

        } else {
            const cardsLS = localStorage.getItem('cards-storage');

            if (cardsLS) {
                const cardsGroup = JSON.parse(cardsLS) as CardGroupProps[];
                const updateCards = updateFn(cardsGroup);

                localStorage.setItem('cards-storage', JSON.stringify(updateCards));
            }
        }
    }

    const createCardGroup = (
        {idBoard, idList, cards}:
        {idBoard: string, idList: string, cards: CardProps[]}
    ) => {
        if (userAuth) {

        } else {
            const cardsLS = localStorage.getItem('cards-storage');
            if (cardsLS) {
                const cardsGroup = JSON.parse(cardsLS) as CardGroupProps[];
                localStorage.setItem('cards-storage', JSON.stringify([...cardsGroup, {idBoard, idList, cards}]));
            }
        }
    }

    return { cardsServices, createCardGroup }
} 