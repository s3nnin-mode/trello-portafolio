import '../../styles/components/reusables/modalToRemoveItem.scss';
import { CardProps, ListProps } from "../../types/boardProps";
import { Backdrop, Box, Modal } from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { useListsServices } from '../../services/listsServices';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { deleteListFirebase } from '../../services/firebase/updateData/updateLists';
import { deleteCard } from '../../services/firebase/updateData/updateCards';
import { useCardsServices } from '../../services/cardsServices';

interface ModalRemoveListProps {
  show: boolean
  onHide: () => void
  idBoard: string
  list: ListProps
  card?: CardProps
  itemToRemove: 'card' | 'list'
}

export const ModalToRemoveItem: React.FC<ModalRemoveListProps> = ({show, onHide, card, list, idBoard, itemToRemove}) => {
  const { listsService } = useListsServices();
  const { cardsServices } = useCardsServices();
  const { userAuth } = useAuthContext();

  const handleRemoveList = () => {

    if (userAuth) {
      deleteListFirebase({idBoard, idList: list.idList});
    }

    listsService({
      updateFn: (state) => state.map((listGroup) => 
      listGroup.idBoard === idBoard ?
      {...listGroup, lists: listGroup.lists.filter(l => l.idList !== list.idList)} :
      listGroup
      )
    });

    onHide();
  }

  const handleRemoveCard = ({idBoard, card}:{idBoard: string, card: CardProps}) => {
    // const idList = cardsGroup.find(cardGroup => cardGroup.cards.some(c => c.idCard === card.idCard))?.idList;
    // if (!idList) return;

    if (userAuth) {
      deleteCard({idBoard, idList: list.idList, idCard: card.idCard});
    }

    cardsServices({
      updateFn: (cardsGroup) => cardsGroup.map(cardGroup => 
        cardGroup.idBoard === idBoard && cardGroup.idList == list.idList
        ? 
        {...cardGroup, cards: cardGroup.cards.filter(c => c.idCard !== card.idCard)}
        :
        cardGroup
      )
    });

    onHide();
  }

  const handleRemoveItemCard = () => {
    if (!card) return;
    handleRemoveCard({idBoard, card});
  };

  const actions = {
    list: handleRemoveList,
    card: handleRemoveItemCard
  }

  return (
    <Modal
      sx={{
        minHeight: '100vh',
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'        
      }}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={show}
      onClose={onHide}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 350,
        },
      }}
    >
      <Box className='modal_to_remove_item'>
        <IoMdClose onClick={onHide} className='icon_close_modal_to_remove_item' />
        {itemToRemove === 'list'
        ? <p className='roboto'>¿Estás seguro de que quieres eliminar la lista <span>"{list.nameList}"?</span></p>
        : <p className='roboto'>¿Estás seguro de que quieres eliminar la tarjeta <span>"{card?.nameCard}"?</span></p>
        }
        <button className='inter' onClick={actions[itemToRemove]}>       
          Eliminar
        </button>
      </Box>
    </Modal>
  )

};