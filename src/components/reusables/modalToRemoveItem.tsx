import '../../styles/components/reusables/modalToRemoveItem.scss';
import { Modal, Button } from "react-bootstrap";
import { CardProps, ListProps } from "../../types/boardProps";
import { useListsServices } from '../../services/listsServices';
import { useCardsServices } from "../../services/cardsServices";

interface ModalRemoveListProps {
    show: boolean
    onHide: () => void
    idBoard: string
    list: ListProps
    card?: CardProps
    itemToRemove: 'card' | 'list'
}

//AGREGAR ANIMACION DE ELIMINACION SUAVES

export const ModalToRemoveItem: React.FC<ModalRemoveListProps> = ({show, onHide, card, list, idBoard, itemToRemove}) => {
    const { listsService } = useListsServices();
    const { cardsServices } = useCardsServices();

    const handleRemoveList = () => {
        const idList = list.idList;
        listsService({
            updateFn: (state) => state.map((listGroup) => 
            listGroup.idBoard === idBoard ?
            {...listGroup, lists: listGroup.lists.filter(list => list.idList !== idList)} :
            listGroup
            )
        });
        onHide();
    }

    const handleRemoveCard = () => {
        const idCardToRemove = card?.idCard;
        cardsServices({
            updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
            (cardGroup.idBoard === idBoard && cardGroup.idList === list.idList)
            ?
            {
                ...cardGroup,
                cards: cardGroup.cards.filter((card) => card.idCard !== idCardToRemove)
            }
            :
            cardGroup
            )
        })
    }

    const actions = {
        list: handleRemoveList,
        card: handleRemoveCard
    }

    return (
        <Modal className='modal_to_remove_item' show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body style={{textAlign: 'center'}}>
            {
                itemToRemove === 'list'
                ?
                <p>Estas seguro de que quieres eliminar la lista <span>"{list.nameList}"?</span></p>
                :
                <p>Estas seguro de que quieres eliminar la tarjeta <span>"{card?.nameCard}"?</span></p>
            }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={actions[itemToRemove]}>       
                    Remove
                </Button>
            </Modal.Footer>
        </Modal>
    )
};