import { useEffect, useState } from 'react';
import '../../../styles/formMoverLista.scss';
import { BoardProps, ListProps } from '../../../types/boardProps';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useListsStore } from '../../../store/listsStore';

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
    const [currentLists, setCurrentLists] = useState<ListProps[]>();

    useEffect(() => {
        const indexListGroup = listsGroup.findIndex(listGroup => listGroup.idBoard === idBoard);
        
        if (indexListGroup > -1) {
            setCurrentLists(listsGroup[indexListGroup].lists);      //listas actuales para iterar y saber su posicion

            const indexList = listsGroup[indexListGroup].lists.findIndex(l => l.idList === list.idList); //index/posicion actual
            if (indexList > -1) {
                console.log('index', indexList)
                console.log('current position: ', indexList + 1);
                const currentPosition = indexList + 1;
                setCurrentPosition(currentPosition);
            }
        }

    }, []);

    const [showPositions, setShowPositions] = useState(false);

    return (
        <div className='form_move_list_container' onPointerDown={(e) => e.stopPropagation()}>
            <header>
                <span onClick={closeForm}>back</span>
                <span>Move list {list.nameList}</span>
                <span onClick={closeAll}>X</span>
            </header>

            <form>
                <h2>Position</h2>
                <button type='button' className='btn_handle_positions' onClick={() => setShowPositions(!showPositions)}>
                    <span>{currentPosition || 'cargando..'}</span>
                    {showPositions ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {
                    showPositions && (
                    <div className='positions'>
                        {
                            currentLists?.map((list, index) => (
                                <button type='button' key={list.idList} onClick={() => setCurrentPosition(index + 1)}>
                                    {index + 1 === currentPosition ? `${index + 1} current` : index + 1}
                                </button>
                            ))
                        }
                    </div>
                    )
                }  
                {
                    currentPosition !== undefined && (
                        <button className='btn_move' type='button' onClick={() => callback(currentPosition - 1)}> {/*el callback necesita el index, asi que como current position es el index + 1, solo se le vuelve a restar ese 1*/}
                            Move
                        </button>
                    )
                } 
            </form>
        </div>
    )
}