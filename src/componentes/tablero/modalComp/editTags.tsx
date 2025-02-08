import '../../../styles/tablero/list/options/tag/editTag.scss';
import React, { useEffect, useState } from "react";
import { TargetTagsProps } from "../../../types/boardProps"
import { Button } from "react-bootstrap";
import { useTargetsStore } from '../../../store/targetsStore';

interface EditTagsProps {
    idBoard: string
    idList: string
    idTarget: string
    tag: TargetTagsProps
}

const colors = [
    "#FF5733", "#FF6F61", "#FF8C42", "#FFA07A", "#FF4500", // Tonos de naranja/rojo
    "#33FF57", "#61FF6F", "#42FF8C", "#7AFFA0", "#00FF45", // Tonos de verde
    "#3357FF", "#6F61FF", "#8C42FF", "#A07AFF", "#4500FF", // Tonos de azul/morado
    "rgba(255, 87, 51, 0.5)", "rgba(255, 111, 97, 0.5)", // Naranjas con opacidad
    "rgba(51, 255, 87, 0.7)", "rgba(97, 255, 111, 0.7)", // Verdes con opacidad
    "rgba(51, 87, 255, 0.8)", "rgba(111, 97, 255, 0.8)",  // Azules con opacidad
    'red', 'blue', 'green'
  ];
  

export const EditTags: React.FC<EditTagsProps> = ({tag, idBoard, idList, idTarget}) => {
    const { setUpdateTag } = useTargetsStore()
    const [inputValue, setInputValue] = useState('');
    const [colorTag, setColorTag] = useState('');

    useEffect(() => {
        setInputValue(tag.nameTag);
        setColorTag(tag.color);
    }, []);

    const handleSave = () => {
        const idTag = tag.idTag;
        const nameTag = inputValue;
        const color = colorTag;

        setUpdateTag({idBoard, idList, idTarget, idTag, nameTag, color});
    }

    return (
        <div className='container_edit_tag'>
            <header>
                <span>back</span>
                <span>Etiquetas</span>
                <span>X</span>
            </header>
            <main>
                <article className='current_tag_to_edit'>
                    <div style={{ backgroundColor: colorTag }} >
                        {inputValue}
                    </div>
                </article>
                <article className='input_to_edit_tag'>
                    <p>Titulo</p>
                    <input type='text' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                </article>
                <article className='tag_colors'>
                    <p>Selecciona un color</p>
                    <div>
                        {
                        colors.map((color) => (
                            <button 
                            onClick={() => setColorTag(color)}
                            style={{backgroundColor: color, border: color === colorTag ? '2px solid' : 'none'}} />
                            )
                        )
                        }
                    </div>
                </article>
                <article>
                    <button>X quitar color</button>
                </article>
                <article>
                    <button onClick={handleSave}>Guardar</button>
                    <button>Eliminar</button>
                </article>
            </main>
        </div>
    )
}