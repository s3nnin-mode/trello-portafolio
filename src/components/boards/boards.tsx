import '../../styles/components/boards/boards.scss';
import { BtnAdd } from '../reusables/btnAgregar';
import { useNavigate } from 'react-router-dom';
import { useBoardsStore } from '../../store/boardsStore';
import { useBoardsServices } from '../../services/boardsServices';
import { useListsServices } from '../../services/listsServices';
import { BoardProps, CardGroupProps, ListsGroup } from '../../types/boardProps';
import { useListsStore } from '../../store/listsStore';
import { getCardsFirebase, getListsFirebase, getTagsFirebase } from '../../services/firebase/firebaseFunctions';
import { useCardsStore } from '../../store/cardsStore';
import { useTagsStore } from '../../store/tagsStore';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { addBoardFirebase } from '../../services/firebase/updateData/updateBoards';
import { Box } from '@mui/material';
import { useEffect } from 'react';

const useBoards = () => {
  const { boards } = useBoardsStore();
  const { boardsService } = useBoardsServices();
  const { createGroupList } = useListsServices();
  const { userAuth } = useAuthContext();

  const addNewBoard = (nameBoard: string) => {
    const idBoard = (nameBoard + Date.now()).toString();
    const newBoard: BoardProps = { idBoard, nameBoard };
      
    boardsService({
      updateFn: (boards) => [...boards, newBoard]
    });
    createGroupList({idBoard}); //crear grupo de lista con idBoard para saber que pertenece a este board e inicializar un array lists vacio

    if (userAuth) {
      addBoardFirebase(newBoard);
    }
  }

  return { boards, addNewBoard }
}

export const Tableros = () => {
  const { boards, addNewBoard } = useBoards();
  const { loadLists } = useListsStore();
  const { loadCards } = useCardsStore();
  const { loadTags } = useTagsStore();
  const { userAuth, fetchData } = useAuthContext();

  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleClick = async (idBoard: string) => {
    if (userAuth) {
      const listsData = await getListsFirebase(idBoard);

      const lists = [{
        idBoard,
        lists: listsData
      }];
      loadLists(lists);

      const fetchCards = async () => {
        return Promise.all(listsData.map(async list => {
          const cards = await getCardsFirebase(idBoard, list.idList);
          
          const cardGroup: CardGroupProps = {
            idBoard,
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
      navigate(`${idBoard}`);
      return
    } 
    navigate(`${idBoard}`);
  }

  return (
    <div className='boards_container'>
      <h2 className='inter_title'>Mis tableros</h2>
      <BtnAdd 
        createListOrTargetName={addNewBoard} 
        nameComponentToAdd='board' 
        className='btn_add_board'
      />

      <div className='divider'></div>
      
      <div className='boards'>
        {
          boards.length > 0 && (
            boards.map(board => {
              console.log(board)
              return (
                <Box
                
                 className='board' onClick={() => handleClick(board.idBoard)} key={board.idBoard}>
                  <span className='name_board inter_title'>{board.nameBoard}</span>
                  <span className='icon_fav'>Star fav</span>
                </Box>
              )
            })
          )
        }
      </div>
    </div>
  )
}