import '../../../styles/tablero/list/options/tag/editTag.scss';
import React, { useEffect, useState } from "react";
import { TagsProps } from "../../../types/boardProps"
import { useTagsStore } from '../../../store/tagsStore';

const colors = [
    "#E63946", "#F4A261", "#2A9D8F", "#264653", "blue",
    "#F39C12", "#16A085", "#2980B9", "#D35400", "#C0392B",
    "#3498DB", "#27AE60", "#8E44AD", "#F1C40F", "#2C3E50",
    "#E67E22", "#1ABC9C", "#9B59B6", "#34495E", "#E74C3C"
];

interface EditTagsProps {
    idBoard?: string
    idList?: string
    idTarget?: string
    tag?: TagsProps
    titleAction: 'Editar' | 'Crear'
    closeComponent: () => void
    closeAll: () => void
} 

export const EditTags: React.FC<EditTagsProps> = ({idBoard, idList, idTarget, tag, titleAction, closeAll, closeComponent}) => {
    const { setUpdateTag, setCreateTag, setRemoveTag } = useTagsStore();
    const [nameTag, setNameTag] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {        //si es para editar una tag existente se cargan sus respectivas caracteristicas(color, nameTag)
        if (!tag) return;
        setNameTag(tag.nameTag);
        setColor(tag.color);
    }, []);

    const handleSaveChanges = () => {
        if (!tag) return
        const idTag = tag.idTag;
        setUpdateTag({idTag, nameTag, color});
        closeComponent();
    }

    const createTag = () => {
        if (!idBoard || !idList || !idTarget) return
        const newTag: TagsProps = {
            idTag: (idTarget + idList + idBoard + Date.now()).toString(), 
            color, 
            nameTag,
            targetsThatUseIt: [
                {idBoard, idList, idTarget}
            ]
        }
        setCreateTag(newTag);
    }

    const removeTag = () => {
        if (!tag) return
        const idTag = tag.idTag;
        setRemoveTag(idTag);        //falta agregar modal para confirmar eliminacion de una etiqueta
        closeComponent();
    }

    return (
        <div className='container_edit_tag'>
            <header>
                <button onClick={closeComponent}>back</button>
                <span>{titleAction} etiqueta</span>
                <button onClick={closeAll}>X</button>
            </header>
            <main>
                <article className='current_tag_to_edit'>
                    <div style={{ backgroundColor: color }} >
                        {nameTag}
                    </div>
                </article>
                <article className='input_to_edit_tag'>
                    <p>Titulo</p>
                    <input type='text' value={nameTag} onChange={(e) => setNameTag(e.target.value)} />
                </article>
                <article className='tag_colors'>
                    <p>Selecciona un color</p>
                    <div>
                        {
                        colors.map((availableColor) => (
                            <button 
                            key={availableColor}
                            onClick={() => setColor(availableColor)}
                            style={{backgroundColor: availableColor, border: availableColor === color ? '2px solid' : 'none'}} />
                            )
                        )
                        }
                    </div>
                </article>
                <article className='article_remove_color'>
                    <button onClick={() => setColor('grey')}>Quitar color</button>
                </article>
                <article className='btns_actions'>
                    <button onClick={titleAction === 'Editar' ? handleSaveChanges : createTag}>
                        {titleAction === 'Editar' ? 'Guardar' : 'Crear'}
                    </button>
                    {titleAction === 'Editar' && <button onClick={removeTag}>Eliminar</button>}
                </article>
            </main>
        </div>
    )
}