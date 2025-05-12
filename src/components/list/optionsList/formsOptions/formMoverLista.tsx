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

  useEffect(() => {
    const listsRef = listsGroup.find(listGroup => listGroup.idBoard === idBoard);
    if (listsRef) setCurrentLists(listsRef?.lists);

    const indexList = listsRef?.lists.findIndex(l => l.idList === list.idList);
    if (indexList) setCurrentPosition(indexList + 1);
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
    color: '#2e2e2e',
    borderRadius: '5px'
  }

  const positions = useMemo(() =>
    currentLists?.map((list, index) => (
      <button
        className='roboto'
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

          {
            newPosition !== null && (
              <h2 className='move_to_this_position'>Mover a la posición: <span>{newPosition}</span></h2>
            )
          }

          <h2>Seleccione la nueva posición:</h2>
          <div className='positions'>
            {
              positions
            }
          </div>

          {/*el callback necesita el index, asi que como current position es el index + 1, solo se le vuelve a restar ese 1*/}
          {
            <button 
              className='btn_move inter'  
              type='button' 
              onClick={() => {
                if (!newPosition) return;
                callback(newPosition - 1)
              }}> 
              Mover lista
            </button>
          } 
        </form>
      </div>
      <div className='backdrop_move_list'></div>
    </>
  )
}