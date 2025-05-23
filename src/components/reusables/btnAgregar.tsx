import React, { useEffect, useRef } from 'react';
import '../../styles/components/reusables/btnToAdd.scss';
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from 'react';
import { Button } from '@mui/material';

interface BtnAddProps {
  createListOrTargetName: (name: string) => void;
  nameComponentToAdd: 'board' | 'list' | 'target'
  className: string
}

export const BtnAdd: React.FC<BtnAddProps> = ({ createListOrTargetName, nameComponentToAdd, className }) => {
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const cancel = () => {
    setInputValue('');
    setShowForm(false)
  }

  const handleClick = () => {
    setShowForm(false);
    if (inputValue.trim() === '') return;
    createListOrTargetName(inputValue);
    setInputValue('');
  }

  const handleKeyDown = (e:React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  }

  const componentsPlaceholder = {
    board: 'el tablero',
    list: 'la lista',
    target: 'la tarjeta'
  }

  const componenteToAdd = {
    board: 'tablero',
    list: 'lista',
    target: 'tarjeta'
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  return (
    <div 
      className={`container_btn_add ${className}`} 
      onPointerDown={(e) => e.stopPropagation()}
    >
      {
        !showForm && (
          <Button
          variant='contained'
          className='btn_add_some'
          onClick={() => setShowForm(true)} 
          >
            <AiOutlinePlus className='icon_add' />
            <span className=''>
              Agregar {componenteToAdd[nameComponentToAdd]}
            </span>
          </Button>
        )
      }
      {
        showForm && (
          <form onSubmit={(e) => e.preventDefault()} className='form_add_some'>
            <input
              ref={inputRef}
              onKeyDown={(e) => e.stopPropagation()}
              type='text'
              className='input_add work_sans'
              placeholder={`Titulo de ${componentsPlaceholder[nameComponentToAdd]}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className='actions'>
              <Button type='submit' className='btn_add' onKeyDown={handleKeyDown} onClick={handleClick} >Agregar</Button>
              <Button type='button' className='btn_cancel' onClick={cancel} >Cancelar</Button>
            </div>
          </form>
        )
      }
    </div>
  )
}

// className={`btn_add_${showForm ? 'hidden' : 'show'}`}

// className={`form_add_${showForm ? 'show' : 'hidden'}`}