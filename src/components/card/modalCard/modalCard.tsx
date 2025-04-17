import '../../../styles/components/card/modalCard/modalCard.scss';
import { BoardProps, ListProps, CardProps, CardGroupProps } from '../../../types/boardProps';
//COMPONENTS
import { CardModalCover } from "./modalComponents/cover/coverCardModal";
import { TitleModalCard } from "./modalComponents/titleModalCard";
import { ActiveTags } from "./activeTags";
import { CardDescription } from './modalComponents/cardDescription';

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoardFirebase } from '../../../services/firebase/updateData/updateBoards';
import { getListFirebase } from '../../../services/firebase/updateData/updateLists';
import { getCardFirebase } from '../../../services/firebase/updateData/updateCards';
import { useAuthContext } from '../../../customHooks/useAuthContext';
import { useListsStore } from '../../../store/listsStore';
import { useBoardsStore } from '../../../store/boardsStore';
import { useCardsStore } from '../../../store/cardsStore';
import { useTagsStore } from '../../../store/tagsStore';
import { getCardsFirebase, getListsFirebase, getTagsFirebase } from '../../../services/firebase/firebaseFunctions';

// interface ModalTargetComponentProps {
//   card: CardProps
//   list: ListProps
//   board: BoardProps
//   closeModal: () => void
//   open: boolean
// }

export const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  return `rgb(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, .4)`;
}

// React.FC<ModalTargetComponentProps>
// { card, list, board, closeModal, open }

export const getBoard = async (idBoard: string) => {
  const board = await getBoardFirebase(idBoard);
  return board
}

export const getList = async ({idBoard, idList}: {idBoard: string, idList: string}) => {
  const list = await getListFirebase({idBoard, idList});
  return list;
}

export const getCard = async ({ idBoard, idList, idCard }: { idBoard: string, idList: string, idCard: string }) => {
  const card = await getCardFirebase({ idBoard, idList, idCard });
  return card;
}


export const CardModal = () => {

  const { getUserAuthState } = useAuthContext();
  const { currentIdBoard, idCard, idList } = useParams();
  const { listsGroup } = useListsStore();
  const { boards, loadBoards } = useBoardsStore();
  const { loadCards, cardsGroup } = useCardsStore();
  const { loadLists } = useListsStore();
  const { loadTags } = useTagsStore();

  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const [list, setList] = React.useState<ListProps>();
  const [board, setBoard] = React.useState<BoardProps | undefined>();
  const [card, setCard] = React.useState<CardProps>();

  const [loader, setLoader] = React.useState(false);

  // React.useEffect(() => {
    
  //   if (userAuth) {
  //     // const fetchAll = async () => {
  //     //   if (!currentIdBoard || !idList || !idCard) return;
    
  //     //   const [board, list, card] = await Promise.all([
  //     //     getBoard(currentIdBoard),
  //     //     getList({ idBoard: currentIdBoard, idList }),
  //     //     getCard({ idBoard: currentIdBoard, idList, idCard })
  //     //   ]);
    
  //     //   if (board) setBoard(board);
  //     //   if (list) setList(list);
  //     //   if (card) setCard(card);
        
  //     // };
    
  //     fetchAll();

  //     return;
  //   }

  //   const boardsLS = localStorage.getItem('boards-storage');
  //   const listsLS = localStorage.getItem('lists-storage');
  //   const cardsLS = localStorage.getItem('cards-storage');
  //   const tagsLS = localStorage.getItem('tags-storage');

  //   if (boardsLS && listsLS && cardsLS && tagsLS) {
  //     loadBoards(JSON.parse(boardsLS));
  //     loadLists(JSON.parse(listsLS));
  //     loadCards(JSON.parse(cardsLS));
  //     loadTags(JSON.parse(tagsLS));
  //     return
  //   }

  //   navigate('/');
    
  // }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoader(true)
      const user_Auth = await getUserAuthState();
      if (!currentIdBoard) return

      if (user_Auth) {

        const boardData = await getBoard(currentIdBoard);
        loadBoards([boardData]);

        const listsData = await getListsFirebase(currentIdBoard);

        const lists = [{
          idBoard: currentIdBoard,
          lists: listsData
        }];

        loadLists(lists);
        console.log('se cargaron listas de tablero: ', listsData, lists)
    
        const fetchCards = async () => {
          return Promise.all(listsData.map(async list => {
            const cards = await getCardsFirebase(currentIdBoard, list.idList);
            
            const cardGroup: CardGroupProps = {
              idBoard: currentIdBoard,
              idList: list.idList,
              cards
            }
            return cardGroup
          }))
        }

        setLoader(false);
  
        const cardsGroup = await fetchCards();
        loadCards(cardsGroup);

        const tags = await getTagsFirebase();
        loadTags(tags);
        return
      }

      const boardsLS = localStorage.getItem('boards-storage');
      const listsLS = localStorage.getItem('lists-storage');
      const cardsLS = localStorage.getItem('cards-storage');
      const tagsLS = localStorage.getItem('tags-storage');
  
      if (boardsLS && listsLS && cardsLS && tagsLS) {
        loadBoards(JSON.parse(boardsLS));
        loadLists(JSON.parse(listsLS));
        loadCards(JSON.parse(cardsLS));
        loadTags(JSON.parse(tagsLS));
        setLoader(false);
        return
      }
      setLoader(false);
      navigate('/')
    }   
    fetchData();
  }, []); //se carga los datos del tablero actual según la ruta

  React.useEffect(() => {
    const board = boards.find(b => b.idBoard === currentIdBoard);
    const list = listsGroup.find(group => group.lists.find(l => l.idList === idList))?.lists.find(l => l.idList === idList);
    const card = cardsGroup.find(group => group.cards.find(c => c.idCard === idCard))?.cards.find(c => c.idCard === idCard);

    setBoard(board);
    setList(list);
    setCard(card);
  }, [boards, listsGroup, cardsGroup]); 

  const closeModal = () => {
    setOpen(false);
    navigate(`/kanbaX/${currentIdBoard}`);
  } 

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    background: list ? hexToRgb(list.colorList) : '',
    boxShadow: 24,
  };

	return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={closeModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 350,
        },
      }}
    >
    <Fade in={open}>
      <Box
        onPointerDown={(e) => e.stopPropagation()} //Para que no se pueda arrastrar items con el modal abierto
        sx={{...style}}
        className='card_modal'
      >
        {
          card && board && list && !loader ?
            <>
              <CardModalCover card={card} idBoard={board.idBoard} idList={list.idList} closeModal={closeModal} />
              <div className='modal_content_container'> 
              <TitleModalCard board={board} list={list} card={card} /> 
              <div className='modal_content'>
                <ActiveTags board={board} list={list} card={card} /> 
                <CardDescription card={card} idList={list.idList} idBoard={board.idBoard} /> 
              </div>
              <div className='sidebar_tags' />
            </div>
            </>
          :
          <div className='loader_test'></div>
        }

        {/*CONTENIDO*/}
      
      </Box>
    </Fade>
  </Modal>
	)
}

{/* <Typography id="transition-modal-description" sx={{ mt: 2, color: '#ccc' }}>
						Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
					</Typography> */}

 // <div className='modal_show' onPointerDown={(e) => e.stopPropagation()}>
        //     <CardModalCover card={card} idBoard={board.idBoard} idList={list.idList} closeModal={closeModal} />

        //     <div className='btns_modal'>             {/*SIDEBAR*/}
        //         <BtnOpenTags board={board} list={list} card={card} />
        //         <button className='btn_modal_sidebar'>Editar</button>
        //         <BtnRemoveCard idBoard={board.idBoard} list={list} card={card} />
        //     </div>

        //     <TitleModalCard board={board} list={list} card={card} />
            
        //     <div className='modal_content_container'>         {/*CONTENIDO*/}
        //         <div className='modal_content'>
        //             <div>
        //                 <CardDescription card={card} idList={list.idList} idBoard={board.idBoard} />
        //             </div>
        //         </div>
        //         <div className='sidebar_tags'>
        //             <ActiveTags board={board} list={list} card={card} />   
        //         </div>
        //     </div>
        // </div>