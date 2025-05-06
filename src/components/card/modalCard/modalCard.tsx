import '../../../styles/components/card/modalCard/modalCard.scss';
import { BoardProps, ListProps, CardProps, CardGroupProps, ListsGroup } from '../../../types/boardProps';
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
import { useArchivedElements } from '../../reusables/archivedElements';
import { MsgRoutNotFound } from '../../reusables/msgRoutNotFound';

export const getBoard = async (idBoard: string) => {
  try {
    const board = await getBoardFirebase(idBoard);
    if (!board) throw new Error
    return board;
  } catch(err) {
    throw new Error
  }
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
  const { loadBoards } = useBoardsStore();
  const { loadCards } = useCardsStore();
  const { loadLists } = useListsStore();
  const { loadTags } = useTagsStore();
  const [isCardNotFound, setIsCardNotFound] = React.useState(false);

  const { handleArchivedCard, handleRemoveCard } = useArchivedElements();

  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const [list, setList] = React.useState<ListProps>();
  const [board, setBoard] = React.useState<BoardProps | undefined>();
  const [card, setCard] = React.useState<CardProps>();


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
      const user_Auth = await getUserAuthState();
      if (!currentIdBoard) return

      if (user_Auth) {

        const boardData = await getBoard(currentIdBoard);
        loadBoards([boardData]);
        setBoard(boardData);

        const listsData = await getListsFirebase(currentIdBoard);
        const lists = [{ idBoard: currentIdBoard, lists: listsData }];

        const list = listsData.find(list => list.idList === idList);
        setList(list);

        loadLists(lists);
        console.log('se cargaron listas de tablero: ', listsData, lists)
    
        const fetchCards = async () => {
          return Promise.all(listsData.map(async list => {
            const cards = await getCardsFirebase(currentIdBoard, list.idList);

            const card = cards.find(card => card.idCard === idCard); //Para cargar mas rapido la card se busca de una vez de los arrays obtenidos de firebase
            if (card) setCard(card);
            
            const cardGroup: CardGroupProps = {
              idBoard: currentIdBoard,
              idList: list.idList,
              cards
            }
            return cardGroup
          }))
        }
  
        const cardsGroup = await fetchCards();
        loadCards(cardsGroup);

        const tags = await getTagsFirebase();
        loadTags(tags);

        //    //    //    //    //

        // const board = boards.find(b => b.idBoard === currentIdBoard);
        // const list = lists.find(group => group.lists.find(l => l.idList === idList))?.lists.find(l => l.idList === idList);
        const card = cardsGroup.find(group => group.cards.find(c => c.idCard === idCard))?.cards.find(c => c.idCard === idCard);
        if (!card) {
          setIsCardNotFound(true);
        }
        
        return
      }

      const boardsLS = localStorage.getItem('boards-storage');
      const listsLS = localStorage.getItem('lists-storage');
      const cardsLS = localStorage.getItem('cards-storage');
      const tagsLS = localStorage.getItem('tags-storage');
  
      if (boardsLS && listsLS && cardsLS && tagsLS) {
        const boards: BoardProps[] = JSON.parse(boardsLS);

        setBoard(() => {
          return boards.find(b => b.idBoard === currentIdBoard);
        })

        const lists: ListsGroup[] = JSON.parse(listsLS);
        setList(() => {
          return lists.find(listGroup => listGroup.lists.some(l => l.idList === idList))?.lists.find(list => list.idList === idList);
        })

        const cards: CardGroupProps[] = JSON.parse(cardsLS);

        const card = cards.find(cardGroup => cardGroup.cards.some(c => c.idCard === idCard))?.cards.find(card => card.idCard === idCard);

        if (card) {
          setCard(card);
        } else {
          setIsCardNotFound(true);
        }

        loadBoards(boards);
        loadLists(lists);
        loadCards(cards);

        loadTags(JSON.parse(tagsLS));

        return
      }
      navigate('/')
    }   
    fetchData();
  }, []); //se carga los datos del tablero actual según la ruta

  // React.useEffect(() => {
  //   const board = boards.find(b => b.idBoard === currentIdBoard);
  //   const list = listsGroup.find(group => group.lists.find(l => l.idList === idList))?.lists.find(l => l.idList === idList);
  //   const card = cardsGroup.find(group => group.cards.find(c => c.idCard === idCard))?.cards.find(c => c.idCard === idCard);

  //   if (!card) {
  //     setIsCardNotFound(true);
  //     console.log('no se encontró card')
  //   } else {
  //     setIsCardNotFound(false)
  //     console.log('card encontrada: ', card)
  //   }
  //   setBoard(board);
  //   setList(list);
  //   setCard(card);
    
  // }, [boards, listsGroup, cardsGroup]); 

  const closeModal = () => {
    setOpen(false);
    navigate(`/kanbaX/${currentIdBoard}`);
  } 

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1E1E1E',
    borderRadius: '12px',
    borderLeft: `6px solid ${card?.coverColorCard}`,
  };

	return (
    <Modal
      sx={{
        minHeight: '100vh',
        overflowY: 'auto', 
      }}
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
          card && list && board ? (
            <>
              <CardModalCover card={card} idBoard={board.idBoard} idList={list.idList} closeModal={closeModal} />

              <div className='modal_content_container'> 
                <div className='modal_card_actions'>
                  <button 
                    className='btn_archive_card' 
                    onClick={() => handleArchivedCard({idBoard: board.idBoard, idList: list.idList, idCard: card.idCard, card})}
                  >
                    {card.archived ? 'Desarchivar' : 'Archivar'}
                  </button>
                  {card.archived && <button className='btn_remove_card' onClick={() => handleRemoveCard({idBoard: board.idBoard, card})}>Eliminar tarjeta</button>}
                </div>
                <TitleModalCard board={board} list={list} card={card} /> 
                <div className='modal_content'>
                  <ActiveTags board={board} list={list} card={card} /> 
                  <CardDescription card={card} idList={list.idList} idBoard={board.idBoard} /> 
                </div>
                <div className='sidebar_tags' />
              </div>
            </>
          )
          : isCardNotFound 
          ? <MsgRoutNotFound routToElement='card' />
          : <div className='loader_test'></div>
        }

        {/* {isCardNotFound 
            ? <MsgRoutNotFound routToElement='card' />
            : <div className='loader_test'></div>} */}
      
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