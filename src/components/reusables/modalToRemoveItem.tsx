import '../../styles/components/reusables/modalToRemoveItem.scss';
import { BoardProps, CardProps, ListProps } from "../../types/boardProps";
import { Backdrop, Box, Modal } from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { useListsServices } from '../../services/listsServices';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { deleteListFirebase } from '../../services/firebase/updateData/updateLists';
import { deleteCard } from '../../services/firebase/updateData/updateCards';
import { useCardsServices } from '../../services/cardsServices';
import { removeBoard } from '../../services/firebase/updateData/updateBoards';
import { useBoardsServices } from '../../services/boardsServices';

interface ModalRemoveListProps {
  show: boolean
  onHide: () => void
  idBoard: string
  board?: BoardProps
  list?: ListProps
  card?: CardProps
  itemToRemove: 'card' | 'list' | 'board'
}

export const ModalToRemoveItem: React.FC<ModalRemoveListProps> = ({show, onHide, card, list, idBoard, board, itemToRemove}) => {
  const { listsService } = useListsServices();
  const { cardsServices } = useCardsServices();
  const { boardsService } = useBoardsServices();

  const { userAuth } = useAuthContext();

  // const [nameItemToRemove, setNameItemToRemove] = useState('');

  // useEffect(() => {
  //   if (itemToRemove === 'card' && card) {
  //     setNameItemToRemove(card?.nameCard);
  //   } else if (itemToRemove === 'list' && list) {
  //     setNameItemToRemove(list.nameList)
  //   }
  // }, [])

  const handleRemoveList = () => {
    if (!list) return;
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
    if (!list) return;

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

  const handleRemoveBoard = () => {
    removeBoard({idBoard});
    boardsService({
      updateFn: (boardsGroup) => boardsGroup.filter(b => b.idBoard !== idBoard)
    });
    onHide();
  };

  const actions = {
    list: handleRemoveList,
    card: handleRemoveItemCard,
    board: handleRemoveBoard
  }

  const itemsName = {
    card: <p className='montserrat'>¿Estás seguro de que quieres eliminar la tarjeta <span>{card?.nameCard}</span>?</p>,
    list: <p className='inter'>¿Estás seguro de que quieres eliminar la lista <span>{list?.nameList}</span>?</p>,
    board: <p>¿Estás seguro de que quieres eliminar el tablero <span>{board?.nameBoard}</span>?</p>
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
        <button onClick={onHide}>
          <IoMdClose className='icon_close_modal_to_remove_item' />
        </button>
        {itemsName[itemToRemove]}
        <button className='inter' onClick={actions[itemToRemove]}>       
          Eliminar
        </button>
      </Box>
    </Modal>
  )

};