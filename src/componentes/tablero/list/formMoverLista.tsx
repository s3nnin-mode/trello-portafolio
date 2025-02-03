import { useEffect, useState } from 'react';
import '../../../styles/formMoverLista.scss';
import { BoardProps, ListProps } from '../../../types/boardProps';
import { useBoardsStore } from '../../../store/boardsStore';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FormMoveListProps {
    idBoard: string
    closeForm: () => void
    callback: (position: number) => void
    list: ListProps
}

export const FormMoveList: React.FC<FormMoveListProps> = ({idBoard, list, closeForm, callback}) => {
    const { boards } = useBoardsStore();
    const [position, setPosition] = useState<number>();
    const [currentBoard, setCurrentBoard] = useState<BoardProps>();

    useEffect(() => {
        const indexBoard = boards.findIndex(board => board.idBoard === idBoard);
        if (indexBoard > -1) {
            setCurrentBoard(boards[indexBoard]);
            const indexList = boards[indexBoard].lists.findIndex(l => l.idList === list.idList);
            if (indexList > -1) {
                console.log('current position: ', indexList + 1);
                const currentPosition = indexList + 1;
                setPosition(currentPosition);
            }
        }

    }, []);

    const [showOPtions, setShowOptions] = useState(false);

    return (
        <div className='form_move_list_container' onPointerDown={(e) => e.stopPropagation()}>
            <header>
                <span onClick={closeForm}>back</span>
                <span>Move list</span>
                <span></span>
            </header>

            <form>
                <h2>Position</h2>
                <button type='button' className='btn_handle_positions' onClick={() => setShowOptions(!showOPtions)}>
                    <span>{position || 'cargando..'}</span>
                    {showOPtions ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {
                    showOPtions && (
                    <div className='positions'>
                        {
                            currentBoard?.lists.map((list, index) => (
                                <button type='button' key={list.idList} onClick={() => setPosition(index + 1)}>
                                    {index + 1 === position ? `${index + 1} current` : index + 1}
                                </button>
                            ))
                        }
                    </div>
                    )
                }  
                {
                    position !== undefined && (
                        <button className='btn_move' type='button' onClick={() => callback(position - 1)}>
                            Move
                        </button>
                    )
                } 
            </form>
        </div>
    )
}