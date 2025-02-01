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

    return (
        <div className='title_list'>
            <p className='name_list'
             style={{display: isOpenInput ? 'none' : 'block'}}
             onClick={() => setIsOpenInput(true)}>
                {nameList}
            </p>

            {isOpenInput && (
                <textarea
                style={{overflow: "hidden", resize: "none", fontSize: 22}}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;

                    target.style.height = "auto"; 
                    target.style.height = `${target.scrollHeight}px`;
                }}
                value={nameList}
                onChange={(e) => handleChange(e)} 
                onBlur={() => setIsOpenInput(false)} // Ocultar textarea al perder el foco 
                />
            )}
        </div> 
    )
}