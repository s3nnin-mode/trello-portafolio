import { useContext, useEffect, useState } from 'react';
import '../../styles/tablero/tableros.scss';
import { BtnAdd } from '../tablero/btnAgregar';
import { Link, useNavigate } from 'react-router-dom';
import { BoardsContext } from '../../contextos/boards';
import { useBoardsStore } from '../../store/boardsStore';

export const Tableros = () => {
  const { boards, setBoards, setBoard } = useBoardsStore();
  
  const addNewBoard = (nameBoard: string) => {
    const newBoard = { 
      idBoard: (nameBoard + Date.now()).toString(),
      nameBoard: nameBoard,
      lists: []
    }
    setBoard(newBoard);
  }

  useEffect(() => {
    // const dataLS = localStorage.getItem('boards');

    // if (dataLS) {
    //     setBoards(JSON.parse(dataLS));
    //     console.log('hay LS', JSON.parse(dataLS))
    // } else {
    //     console.log('no hay LS')
    //     localStorage.setItem('boards', JSON.stringify([]))
    // }
  }, []);

  return (
    <div className='boards_container'>
      <h3>Tableros</h3>
      <BtnAdd createListOrTargetName={addNewBoard} btnName='board' className='container_btn_add_board'/>
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