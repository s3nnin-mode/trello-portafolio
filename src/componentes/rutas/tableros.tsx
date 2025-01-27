import { useContext, useEffect, useState } from 'react';
import '../../styles/tablero/tableros.scss';
import { BtnAdd } from '../tablero/btnAgregar';
import { Link, useNavigate } from 'react-router-dom';
import { BoardsContext } from '../../contextos/boards';

interface BoardProps {
  name: string
}

export const useBoards = () => {
  const context = useContext(BoardsContext);

  if (!context) {
    throw new Error(`NO PUEDES USAR EL CONTEXTO FUERA DE APP`);
  }

  return context;
}

export const Tableros = () => {
  const { boards, setBoards } = useBoards();
  
  const addNewBoard = (nameBoard: string) => {
    const newBoard = { 
      name: nameBoard,
      lists: []
    }
    
    const newBoards = [...boards, newBoard];
    setBoards(newBoards);
    localStorage.setItem('boards', JSON.stringify(newBoards));
  }

  return (
    <div className='boards_container'>
      <h3>Tableros</h3>
      <BtnAdd createListOrTargetName={addNewBoard} btnName='board' />
      <div className='divider'></div>
      <div className='boards'>

        {
          boards.map(board => {
            return (
              <Link className='board' to={`/${board.name}`} key={board.name}>
                <span className='name_board'>{board.name}</span>
                <span className='icon_fav'>Star fav</span>
              </Link>
            )
          })
        }

      </div>
    </div>
  )
}