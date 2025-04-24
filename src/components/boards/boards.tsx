import '../../styles/components/boards/boards.scss';
import { BtnAdd } from '../reusables/btnAgregar';
import { useNavigate } from 'react-router-dom';
import { useBoardsStore } from '../../store/boardsStore';
import { useBoardsServices } from '../../services/boardsServices';
import { useListsServices } from '../../services/listsServices';
import { BoardProps } from '../../types/boardProps';
import { useListsStore } from '../../store/listsStore';
import { useCardsStore } from '../../store/cardsStore';
import { useTagsStore } from '../../store/tagsStore';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { addBoardFirebase } from '../../services/firebase/updateData/updateBoards';
import { Box, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';

const useBoards = () => {
  const { boards, loadBoards } = useBoardsStore();
  const { boardsService } = useBoardsServices();
  const { createGroupList } = useListsServices();
  const { userAuth, fetchBoards } = useAuthContext();

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

  return { boards, addNewBoard, fetchBoards, loadBoards }
}

export const Tableros = () => {
  const { boards, addNewBoard, fetchBoards, loadBoards } = useBoards();
  const { loadLists } = useListsStore();
  const { loadCards } = useCardsStore();
  const { loadTags } = useTagsStore();
  const { getUserAuthState } = useAuthContext();
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      setLoader(true);
      const user_auth = await getUserAuthState();

      if (user_auth) {
        setLoader(false);
        fetchBoards();
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
      navigate('/');
    }

    fetchData();
  }, []);

  if (loader) {
    return (
      <div className='container_loader_board'>
        <div className='loader_board'></div>
      </div>
    )
  }

  return (
    <div className='boards_container'>
      <h2 className='inter_title'>Mis tableros</h2>
      <BtnAdd 
        createListOrTargetName={addNewBoard} 
        nameComponentToAdd='board' 
        className='btn_add_board'
      />

      <div className='divider' />
      
      <div className='boards'>
        {
          !loader ?
            boards.map(board => {
              return (
                <Box
                  className='board_item' 
                  onClick={() => navigate(board.idBoard)} 
                  key={board.idBoard}
                >
                  <span className='name_board inter'>
                    {board.nameBoard}
                  </span>
                </Box>
              )
            })
          :
          <Skeleton sx={{ bgcolor: 'grey.800' }} animation={'wave'} variant="rectangular" width={250} height={120} />
        }
      </div>
    </div>
  )
}