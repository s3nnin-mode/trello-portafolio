import '../../styles/components/boards/boards.scss';
import { BtnAdd } from '../reusables/btnAgregar';
import { Link } from 'react-router-dom';
import { useBoardsStoree } from '../../store/boardsStore';
import { useBoardsServices } from '../../services/boardsServices';
import { useListsServices } from '../../services/listsServices';
import { BoardProps } from '../../types/boardProps';

const useBoards = () => {
  const { boards } = useBoardsStoree();
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
                <Link className='board' to={`${board.idBoard}`} key={board.idBoard}>
                  <span className='name_board'>{board.nameBoard}</span>
                  <span className='icon_fav'>Star fav</span>
                </Link>
              )
            })
          )
        }
      </div>
    </div>
  )
}