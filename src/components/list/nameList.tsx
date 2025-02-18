import { useEffect, useState } from "react";
import '../../styles/components/list/nameList.scss';
import {  useListsStore } from '../../store/listsStore';
import { ListProps } from "../../types/boardProps";
import { useListsServices } from "../../services/listsServices";

interface NameListPropsComponent {
    idBoard: string
    list: ListProps
}

export const NameList: React.FC<NameListPropsComponent> = ({idBoard, list}) => {
    const { listsService } = useListsServices();
    const [isOpenInput, setIsOpenInput] = useState(false);
    const [nameList, setNameList] = useState('');

    useEffect(() => {
        setNameList(list.nameList);
        
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const idList = list.idList;
        setNameList(e.target.value); 

        listsService({
            updateFn: (listsGroup) => listsGroup.map((listGroup) => 
                listGroup.idBoard === idBoard
                ?
                {   ...listGroup,
                    lists: listGroup.lists.map((list) => 
                        list.idList === idList ? 
                        { ...list, nameList: e.target.value } 
                        : 
                        list
                    )
                }
                :
                listGroup
            )
        });
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