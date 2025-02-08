import React, { useState } from "react";
import { useTargetsStore } from "../../../../../store/targetsStore";
import { ListProps } from "../../../../../types/boardProps";

interface FormAddTargetProps {
    idBoard: string
    list: ListProps
}

export const FormAddTarget: React.FC<FormAddTargetProps> = ({idBoard, list}) => {
    const { setTargetToTop } = useTargetsStore()
    const [inputValue, setInputValue] = useState('');

    const handleClick = () => {
        const idList = list.idList;
        
        const targetToAdd = {
            idTarget: (inputValue + Date.now()).toString(),
            nameTarget: inputValue, 
            tags: [
                {color: 'red', active: false, nameTag: 'tag1'}, 
                {color: 'blue', active: false, nameTag: 'tag2'}, 
                {color: 'green', active: false, nameTag: 'tag3'}
            ]
        };
        setTargetToTop({idBoard, idList, targetToAdd})
    }


    return (
        {
            !showForm && (
                <button>
                    f
                </button>
            )
        }
        {
            showForm && (
                <form className='form_add_some'>
                    <input
                        type='text'
                        className='input_add'
                        placeholder={`Nombre de ${components[nameComponentToAdd]}`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className='actions'>
                        <button type='button' className='btn_add' onClick={handleClick} >Agregar</button>
                        <button type='button' className='btn_cancel' onClick={cancel} >Cancelar</button>
                    </div>
                </form>
            )
        }
    )
}
    
