import '../../styles/components/boards/boards.scss';
import { BtnAdd } from '../reusables/btnAgregar';
import { useNavigate } from 'react-router-dom';
import { useBoardsStore } from '../../store/boardsStore';
import { useBoardsServices } from '../../services/boardsServices';
import { useListsServices } from '../../services/listsServices';
import { BoardProps, CardGroupProps } from '../../types/boardProps';
import { useListsStore } from '../../store/listsStore';
import { getCardsFirebase, getListsFirebase } from '../../services/firebase/firebaseFunctions';
import { ListProps } from '../../types/boardProps';
import { useCardsStore } from '../../store/cardsStore';

const useBoards = () => {
  const { boards } = useBoardsStore();
  const { boardsService } = useBoardsServices();
  const { createGroupList } = useListsServices();

  const addNewBoard = (nameBoard: string) => {
    const idBoard = (nameBoard + Date.now()).toString();
    const newBoard: BoardProps = { idBoard, nameBoard };
    
    boardsService({
      updateFn: (boards) => [...boards, newBoard]
    });
    createGroupList({idBoard}); //crear grupo de lista con idBoard para saber que pertenece a este board e inicializar un array lists vacio
  }

  return { boards, addNewBoard }
}

export const Tableros = () => {
  const { boards, addNewBoard } = useBoards();
  const { loadLists } = useListsStore();
  const { loadCards } = useCardsStore();

  const navigate = useNavigate();

  const handleClick = async (idBoard: string) => {
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
    navigate(`${idBoard}`);
  }

  return (
    <div className='boards_container'>
      <h3>Tableros</h3>

      <BtnAdd 
        createListOrTargetName={addNewBoard} 
        nameComponentToAdd='board' 
        className='form_add_board'
      />

      <div className='divider'></div>
      
      <div className='boards'>
        {
          boards.length > 0 && (
            boards.map(board => {
              console.log(board)
              return (
                <div className='board' onClick={() => handleClick(board.idBoard)} key={board.idBoard}>
                  <span className='name_board'>{board.nameBoard}</span>
                  <span className='icon_fav'>Star fav</span>
                </div>
              )
            })
          )
        }
      </div>
    </div>
  )
}