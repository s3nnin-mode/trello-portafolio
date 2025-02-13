import '../../styles/tablero/tableros.scss';
import { BtnAdd } from '../tablero/btnAgregar';
import { Link } from 'react-router-dom';
import { useBoardsStoree } from '../../store/boardsStore';
import { useListsStore } from '../../store/listsStore';

export const Tableros = () => {
  // const { boards, setBoard } = useBoardsStore();
  const { boards, setBoard } = useBoardsStoree();
  const { setListGroup } = useListsStore();

  
  const addNewBoard = (nameBoard: string) => {
    const idBoard = (nameBoard + Date.now()).toString()
    const newBoard = { 
      idBoard: idBoard,
      nameBoard: nameBoard,
      lists: []
    }
    setBoard(newBoard);
    setListGroup({idBoard});     //crear objeto con idBoard para saber que pertenece a este board e inicializar un array lists vacio
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
          boards.map(board => {
            console.log(board)
            return (
              <Link className='board' to={`/${board.idBoard}`} key={board.idBoard}>
                <span className='name_board'>{board.nameBoard}</span>
                <span className='icon_fav'>Star fav</span>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}