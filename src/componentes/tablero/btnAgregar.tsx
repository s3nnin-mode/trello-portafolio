import React, { ChangeEvent, useEffect, useRef } from 'react';
import '../../styles/tablero/agregarLista.scss';
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from 'react';

interface BtnAddProps {
    createListOrTargetName: (name: string) => void;
    btnName: string;
    className: string
}

export const BtnAdd: React.FC<BtnAddProps> = ({ createListOrTargetName,  btnName, className}) => {
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
        <div className={className} style={{backgroundColor: showForm ? '#f4f5f7' : 'transparent'}}>
            <button className={`btn_add_${showForm ? 'hidden' : 'show'}`} onClick={() => setShowForm(true)} onPointerDown={(e) => e.stopPropagation()}>
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
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <div className='actions'>
                    <button type='button' className='btn_add' onClick={handleClick} onPointerDown={(e) => e.stopPropagation()}>Agregar</button>
                    <button type='button' className='btn_cancel' onClick={cancel} onPointerDown={(e) => e.stopPropagation()}>Cancelar</button>
                </div>
            </form>
        </div>
    )
}