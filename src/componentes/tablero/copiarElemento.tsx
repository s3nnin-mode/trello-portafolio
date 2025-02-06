import { useEffect, useState } from "react";
import '../../styles/tablero/copiarElement.scss';
import { FaArrowLeft } from "react-icons/fa";

interface FormCopyElementProps {
    value: string            //actual nombre del tablero/lista/target
    nameElement: string     //Elemento a copiar? lista, tablero, target etc
    closeForm: () => void
    closeAll: () => void
    callbackName: (inputText: string) => void
}

export const FormCopyElement: React.FC<FormCopyElementProps> = ({value, nameElement, closeForm, closeAll, callbackName}) => {

    const [inputText, setInputText] = useState('');

    useEffect(() => {
        setInputText(value);
    }, []);

    const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        target.style.height = "auto"; 
        target.style.height = `${target.scrollHeight}px`;
    }

    return (
        <div className='interfaz_copy_element'>
            <header>
                <button onClick={closeForm}>
                    <FaArrowLeft />
                </button>
                <span>
                    copiar {nameElement}
                </span>
                <button onClick={closeAll}>
                    x
                </button>
            </header>

            <form>
                <textarea 
                value={inputText} 
                onInput={onInput}
                onChange={(e) => setInputText(e.target.value)}/>
                <button type='button' onClick={() => callbackName(inputText)}>Copiar</button>
            </form>
        </div>
    )
}