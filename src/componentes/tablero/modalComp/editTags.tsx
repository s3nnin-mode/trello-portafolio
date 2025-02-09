import '../../../styles/tablero/list/options/tag/editTag.scss';
import React, { useEffect, useState } from "react";
import { TagsProps } from "../../../types/boardProps"
import { useTagsStore } from '../../../store/tagsStore';

interface EditTagsProps {
    tag: TagsProps
} 

export const EditTags: React.FC<EditTagsProps> = ({tag}) => {
    const { setUpdateTag, tags } = useTagsStore()
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
        setUpdateTag({idTag, nameTag, color});
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
                        tags.map((tag) => (
                            <button 
                            onClick={() => setColorTag(tag.color)}
                            style={{backgroundColor: tag.color, border: tag.color === colorTag ? '2px solid' : 'none'}} />
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