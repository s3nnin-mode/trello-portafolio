import { useEffect, useState } from 'react';
import '../../../styles/tablero/tagsSettings.scss';
import { BoardProps, ListProps, TargetProps, TargetTagsProps } from '../../../types/boardProps';
import { useTargetsStore } from '../../../store/targetsStore';

interface TagsSettings {
    board: BoardProps
    list: ListProps
    target: TargetProps
    closeTagsSettings: () => void
}

export const TagSettings: React.FC<TagsSettings> = ({ board, list, target, closeTagsSettings }) => {
    const { setActiveTag } = useTargetsStore()
    
    const onChange = (prop: string) => {
        const idBoard = board.idBoard;
        const idList = list.idList;
        const idTarget = target.idTarget;
        const nameTag = prop;
        setActiveTag({ idBoard, idList, idTarget, nameTag })
    }

    return (
        <div className='tags_settings'>
            <header className='tags_settings_header'>
                <div></div>
                <span>Etiquetas</span>
                <button onClick={closeTagsSettings}>X</button>
            </header>
            <input type="text" placeholder='buscar etiquetas...' />
            <span>Etiquetas</span>
            <ul>
                {
                    target.tags.map((tag) => {
                        return (
                        <li key={tag.nameTag}>
                            <input type='checkbox' checked={tag.active} onChange={() => onChange(tag.nameTag)} />
                            <div style={{backgroundColor: tag.color}} />
                            <span>edit</span>
                        </li>
                        )
                    })
                }
            </ul>
        </div>
    )
} 