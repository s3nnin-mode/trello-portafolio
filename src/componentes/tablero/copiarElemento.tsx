import { useEffect, useState } from "react";
import '../../styles/tablero/copiarElement.scss';
import { FaArrowLeft } from "react-icons/fa";

interface FormCopyElementProps {
    callback: (inputText: string) => void
    closeForm: () => void
    value: string
    nameElement: string
}

export const FormCopyElement: React.FC<FormCopyElementProps> = ({closeForm, callback, value, nameElement}) => {

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
                <span onClick={closeForm} style={{cursor: 'pointer'}}>
                    <FaArrowLeft />
                </span>
                <span>
                    copiar {nameElement}
                </span>
                <span>
                </span>
            </header>

            <form>
                <textarea 
                value={inputText} 
                onInput={onInput}
                onChange={(e) => setInputText(e.target.value)}/>
                <button type='button' onClick={() => callback(inputText)}>Copiar</button>
            </form>
        </div>
    )
}