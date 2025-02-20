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
            cardsGroup: updateFn(state.cardsGroup)  //actualiza el estado de cardsGroup independientemente de si el usuario esta autenticado o no
        }));

        if (userAuth) {
            //aqui se haria la peticion a la base de datos para actualizar las cards
        } else {
            const cardsLS = localStorage.getItem('cards-storage');

            if (cardsLS) { 
                const cardsGroup = JSON.parse(cardsLS) as CardGroupProps[];
                const updateCards = updateFn(cardsGroup);

                localStorage.setItem('cards-storage', JSON.stringify(updateCards)); //actualiza el local storage si el usuario no esta autenticado
            }
        }
    }

    const createCardGroup = (   //crea un grupo de cards con un idBoard, idList y cards al momento de crear una lista, para saber que estas cards pertenecen a este tablero y a esta lista
        {idBoard, idList, cards}:  //ya que hay tres estados principales, boardsGroup, listsGroup y cardsGroup, y cada uno tiene su propio estado
        {idBoard: string, idList: string, cards: CardProps[]}
    ) => {
        useCardsStore.setState((state) => ({
            cardsGroup: [...state.cardsGroup, {idBoard, idList, cards}]  //actualiza el estado de cardsGroup
        })); 

        if (userAuth) {

        } else {
            const cardsLS = localStorage.getItem('cards-storage');
            if (cardsLS) {
                const cardsGroup = JSON.parse(cardsLS) as CardGroupProps[];
                const cardsUpdated: CardGroupProps[] = [...cardsGroup, {idBoard, idList, cards}];
                localStorage.setItem('cards-storage', JSON.stringify(cardsUpdated));
            }
        }
    }

    return { cardsServices, createCardGroup }
} 