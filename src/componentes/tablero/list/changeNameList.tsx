import { useEffect, useRef, useState } from "react";
import { ListProps } from "../../../types/boardProps";
import '../../../styles/tablero/nameList.scss';
import { useBoardsStore } from "../../../store/boardsStore";

interface NameListPropsComponent {
    idBoard: string
    list: ListProps
}

export const useNameList = () => {
    
}

export const NameList: React.FC<NameListPropsComponent> = ({idBoard, list}) => {
    const { setNewNameList } = useBoardsStore();

    const [isOpenInput, setIsOpenInput] = useState(false);
    const [nameList, setNameList] = useState('');

    useEffect(() => {
        setNameList(list.nameList);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const idList = list.idList;
        const newNameList = e.target.value;
        setNameList(e.target.value);
        setNewNameList({idBoard, idList, newNameList})
    }

    const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        target.style.height = "auto"; 
        target.style.height = `${target.scrollHeight}px`;
    }

    return (
        <div className='title_list'>
            <p className='name_list'                                         //abrir input
             style={{display: isOpenInput ? 'none' : 'block'}}
             onClick={() => setIsOpenInput(true)}
             onPointerDown={(e) => e.stopPropagation()}
             >        
                {nameList}
            </p>

            {isOpenInput && (
                <textarea
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{overflow: "hidden", resize: "none", fontSize: 22}}
                    onInput={onInput}
                    value={nameList}
                    onChange={handleChange} 
                    onBlur={() => setIsOpenInput(false)} // Ocultar textarea al perder el foco 
                />
            )}
        </div> 
    )
}