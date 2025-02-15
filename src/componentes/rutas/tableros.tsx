import '../../styles/tablero/tableros.scss';
import { BtnAdd } from '../tablero/btnAgregar';
import { Link } from 'react-router-dom';
import { useBoardsStoree } from '../../store/boardsStore';
import { useListsStore } from '../../store/listsStore';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contextos/authUser';

export const useAuthContext = () => {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('no puedes usar el contexto fuera de app');
  }

  return contexto
}

export const Tableros = () => {
  const { boards, setBoard } = useBoardsStoree();
  const { setListGroup } = useListsStore();
  const { userAuth } = useAuthContext();

  useEffect(() => {
    console.log('boards: ', boards)
  }, []);
  
  const addNewBoard = (nameBoard: string) => {
    const idBoard = (nameBoard + Date.now()).toString();

    const newBoard = { 
      idBoard: idBoard,
      nameBoard: nameBoard,
      lists: []
    }
    setBoard(newBoard);
    setListGroup({idBoard});     //crear objeto con idBoard para saber que pertenece a este board e inicializar un array lists vacio
    if (!userAuth) {
      localStorage.setItem('boards-storage', JSON.stringify([...boards, newBoard])); 
    } else { //crear archivo con funciones solo para actualizar localstorage
      //aqui ira logica para agregar a firebase
    }
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