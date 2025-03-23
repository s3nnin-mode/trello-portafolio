import { useEffect, useRef, useState } from "react";
import '../../../../styles/components/list/optionsList/formsOptions/copyElement.scss';
import { FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';

interface FormCopyElementProps {
  value: string            //actual nombre del tablero/lista/target
  nameElement: string     //Elemento a copiar? lista, tablero, target etc
  closeForm: () => void
  closeAll: () => void
  callbackName: (inputText: string) => void
}

export const FormCopyElement: React.FC<FormCopyElementProps> = ({value, nameElement, closeForm, closeAll, callbackName}) => {

  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInputText(value);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    target.style.height = "auto"; 
    target.style.height = `${target.scrollHeight}px`;
  }

  return (
    <>
      <div className='interfaz_copy_element'>
        <header>
          <button onClick={closeForm}>
            <FaArrowLeft className='icons_header_copy_list' />
          </button>
          <span className='inter_title'>
            Copiar {nameElement}
          </span>
          <button onClick={closeAll}>
            <IoMdClose className='icons_header_copy_list' />
          </button>
        </header>

        <form>
          <textarea 
            ref={textareaRef}
            value={inputText} 
            onInput={onInput}
            onChange={(e) => setInputText(e.target.value)} 
          />
          <button className='roboto' type='button' onClick={() => callbackName(inputText)}>
            Copiar
          </button>
        </form>
      </div>

      <div
        onClick={closeAll} 
        className='backdrop_interfaz_copy_element'></div>
      </>
  )
}