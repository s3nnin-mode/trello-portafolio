import React from 'react';
import '../../styles/tablero/agregarLista.scss';
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from 'react';

interface BtnAddProps {
    createListOrTargetName: (name: string) => void;
    btnName: string;
}

export const BtnAdd: React.FC<BtnAddProps> = ({ createListOrTargetName,  btnName}) => {
    const [showForm, setShowForm] = useState(false);
    const [listName, setListName] = useState('');

    const cancel = () => {
        setShowForm(false);
        setListName('');
    }

    const handleClick = () => {
        if (listName.trim() === '') return;
        createListOrTargetName(listName);
        setShowForm(false);
    }

    return (
        <div className='container_btn_add' style={{backgroundColor: showForm ? '#f4f5f7' : 'transparent'}}>
            <button className={`btn_add_${showForm ? 'hidden' : 'show'}`} onClick={() => setShowForm(true)}>
                <AiOutlinePlus className='icon_add' style={{color: btnName === 'list' ? 'white' : 'black'}} />
                <span style={{color: btnName === 'list' ? 'white' : 'black' }}>Agregar {btnName}</span>
            </button>
            <form className={`form_add_${showForm ? 'show' : 'hidden'}`}>
                <input
                    type='text'
                    className='input_add'
                    placeholder={`Nombre de ${btnName == 'list' ? 'la list' : 'la tarjeta'}`}
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                />
                <div className='actions'>
                    <button type='button' className='btn_add' onClick={handleClick}>Agregar</button>
                    <button type='button' className='btn_cancel' onClick={cancel}>Cancelar</button>
                </div>
            </form>
        </div>
    )
}