import { useEffect, useMemo, useState } from 'react';
import '../../../../styles/components/list/optionsList/formsOptions/formMoveList.scss';
import { ListProps } from '../../../../types/boardProps';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useListsStore } from '../../../../store/listsStore';
import { FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';

interface FormMoveListProps {
    idBoard: string
    closeForm: () => void
    closeAll: () => void
    callback: (position: number) => void
    list: ListProps
}

export const FormMoveList: React.FC<FormMoveListProps> = ({idBoard, list, closeForm, closeAll, callback}) => {
  const { listsGroup } = useListsStore();
  const [currentPosition, setCurrentPosition] = useState<number>();
  const [newPosition, setNewPosition] = useState<number | null>(null);

  const [currentLists, setCurrentLists] = useState<ListProps[]>();
  // const [showPositions, setShowPositions] = useState(false);

  useEffect(() => {
    const indexListGroup = listsGroup.findIndex(listGroup => listGroup.idBoard === idBoard);
    if (indexListGroup > -1) {
      setCurrentLists(listsGroup[indexListGroup].lists);      //listas actuales para iterar y saber su posicion

      const indexList = listsGroup[indexListGroup].lists.findIndex(l => l.idList === list.idList); //index/posicion actual
      if (indexList > -1) {
        const currentPosition = indexList + 1;
        setCurrentPosition(currentPosition);
      }
    }
  }, []);

  const handleClick = (newPosition: number) => {
    if (newPosition !== currentPosition) {
      setNewPosition(newPosition);
    }
  }

  const styleNewPosition = {
    border: '2px solid orange',
    borderRadius: '5px'
  }

  const styleCurrenPosition = {
    background: 'cadetblue',
    border: '2px solid cadetblue',
    // color: 'cadetblue',
    color: '#2e2e2e',

    borderRadius: '5px'
  }

  const positions = useMemo(() =>
    currentLists?.map((list, index) => (
      <button
        className='roboto'
        // className='inter_subtitle'
        style={index + 1 === currentPosition ? styleCurrenPosition : index + 1 === newPosition ? styleNewPosition : {}}
        type='button' 
        key={list.idList} 
        onClick={() => handleClick(index + 1)}
      >
        {index + 1 === currentPosition ? `${index + 1} Actual` : index + 1}
      </button>
    )), [currentLists, currentPosition, newPosition]
  )
  
  return (
    <>
      <div className='form_move_list_container' onPointerDown={(e) => e.stopPropagation()}>
        <header>
          <button onClick={closeForm}>
            <FaArrowLeft />
          </button>
          <span className='inter_title'>Mover lista</span>
          <button onClick={closeAll}>
            <IoMdClose />
          </button>
        </header>

        <form>
          <h2>Posición actual: <span> {currentPosition}</span></h2>
          {/* <button type='button' className='btn_handle_positions' onClick={() => setShowPositions(!showPositions)}>
            <span>{currentPosition || 'cargando..'}</span>
            {showPositions ? <FaChevronUp /> : <FaChevronDown />}
          </button> */}
          {
            newPosition !== null && (
              <h2>Mover a la posición: <span>{newPosition}</span></h2>
            )
          }
          <h2>Seleccione la nueva posición:</h2>
          <div className='positions'>
            {
              positions
            }
          </div>

          {/* {
            showPositions && (
            <div className='positions'>
              <h2>Posiciones disponibles:</h2>
              {
                currentLists?.map((list, index) => (
                  <button type='button' key={list.idList} onClick={() => setCurrentPosition(index + 1)}>
                    {index + 1 === currentPosition ? `${index + 1} current` : index + 1}
                  </button>
                ))
              }
            </div>
            )
          }   */}
          {
            newPosition && (
              <button className='btn_move inter' type='button' onClick={() => callback(newPosition - 1)}> {/*el callback necesita el index, asi que como current position es el index + 1, solo se le vuelve a restar ese 1*/}
                Mover lista
              </button>
            )
          } 
        </form>
      </div>
      <div className='backdrop_move_list'></div>
    </>
  )
}