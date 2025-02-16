import '../../styles/components/boards/boards.scss';
import { BtnAdd } from '../reusables/btnAgregar';
import { Link } from 'react-router-dom';
import { useBoardsStoree } from '../../store/boardsStore';
import { useListsStore } from '../../store/listsStore';
import { useAuthContext } from '../../customHooks/useAuthContext';

const useBoards = () => {
  const { boards, setBoard } = useBoardsStoree();
  const { setListGroup } = useListsStore();
  const { userAuth } = useAuthContext();

  const addNewBoard = (nameBoard: string) => {
    const idBoard = (nameBoard + Date.now()).toString();

    const newBoard = { 
      idBoard: idBoard,
      nameBoard: nameBoard,
      lists: []
    }
    setBoard(newBoard);
    setListGroup({idBoard});     //crear objeto con idBoard para saber que pertenece a este board e inicializar un array lists vacio
    
    if (userAuth) {
      console.log('No esta auth: procede a guardar board en LS');   //logica de firebase 
    } else {
      localStorage.setItem('boards-storage', JSON.stringify([...boards, newBoard]));
    }
  }

  return { boards, setBoard, setListGroup, addNewBoard }
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