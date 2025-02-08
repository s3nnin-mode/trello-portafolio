import { useEffect, useState } from 'react';
import '../../../styles/tablero/tagsSettings.scss';
import { BoardProps, ListProps, TargetProps, TargetTagsProps } from '../../../types/boardProps';
import { useTargetsStore } from '../../../store/targetsStore';
import { EditTags } from './editTags';

interface TagsSettings {
    board: BoardProps
    list: ListProps
    target: TargetProps
    closeTagsSettings: () => void
}

export const TagSettings: React.FC<TagsSettings> = ({ board, list, target, closeTagsSettings }) => {
    const { setActiveTag } = useTargetsStore();
    const [isEditTag, setIsEditTag] = useState(false);
    const [tagToEdit, setTagToEdit] = useState<TargetTagsProps>();
    
    const onChange = (prop: string) => {
        const idBoard = board.idBoard;
        const idList = list.idList;
        const idTarget = target.idTarget;
        const nameTag = prop;
        setActiveTag({ idBoard, idList, idTarget, nameTag });
    }

    const handleEditTag = ({tag}:{tag: TargetTagsProps}) => {
        setIsEditTag(true);
        setTagToEdit(tag);
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
                            <span onClick={() => handleEditTag({tag})}>edit</span>
                        </li>
                        )
                    })
                }
            </ul>
            {
                (isEditTag && tagToEdit) && <EditTags idBoard={board.idBoard} idList={list.idList} idTarget={target.idTarget} tag={tagToEdit} />
            }
        </div>
    )
} 