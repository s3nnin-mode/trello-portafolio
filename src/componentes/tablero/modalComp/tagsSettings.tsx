import { useEffect, useState } from 'react';
import '../../../styles/tablero/tagsSettings.scss';
import { BoardProps, ListProps, TargetProps, TagsProps } from '../../../types/boardProps';
import { useTargetsStore } from '../../../store/targetsStore';
import { EditTags } from './editTags';
import { useTagsStore } from '../../../store/tagsStore';

interface TagsSettings {
    board: BoardProps
    list: ListProps
    target: TargetProps
    closeTagsSettings: () => void
}

export const TagSettings: React.FC<TagsSettings> = ({ board, list, target, closeTagsSettings }) => {
    const [isEditTag, setIsEditTag] = useState(false);
    const [tagToEdit, setTagToEdit] = useState<TagsProps>();

    const { tags, setUpdateTag, setTagUsage } = useTagsStore();
    
    const onChange = (prop: string) => {
        console.log('idTag: ',prop);

        const idBoard = board.idBoard;
        const idList = list.idList;
        const idTarget = target.idTarget;
        const idTag = prop;

        // const tagss = tags.map((tag) => {
        //     const test = tag.idTag === idTag;
        //     console.log('test', tag.idTag, idTag ,test)

        //     if (tag.idTag === idTag) {
        //         console.log('esta id del tag es identica a las props: ', tag)

        //         if(tag.targetsThatUseIt.some(target => target.idBoard === idBoard && target.idList === idList && target.idTarget === idTarget)) {
        //             return {
        //                 ...tag,
        //                 targetsThatUseIt: tag.targetsThatUseIt.filter(target => target.idBoard !== idBoard && target.idList !== idList && target.idTarget !== idTarget)
        //             }
        //         }

        //         return {
        //             ...tag,
        //             targetsThatUseIt: [...tag.targetsThatUseIt, { idBoard, idList, idTarget }]
        //         }
        //     }

        //     return tag
            
        // })
        // console.log('update tags: ', tagss);
        
        setTagUsage({idBoard, idList, idTarget, idTag});
    }

    const handleEditTag = ({tag}:{tag: TagsProps}) => {
        setIsEditTag(true);
        setTagToEdit(tag);
    }

    const isActive = ({tag}: {tag: TagsProps}) => {
        return tag.targetsThatUseIt.some((t) => 
                t.idBoard === board.idBoard && t.idList === list.idList && t.idTarget === target.idTarget
                ?
                true
                :
                false
            )
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
                    tags.map((tag) => {
                        return (
                        <li key={tag.idTag}>
                            <input type='checkbox' checked={isActive({tag})} onChange={() => onChange(tag.idTag)} />
                            <div style={{backgroundColor: tag.color}}>{tag.nameTag}</div>
                            <span onClick={() => handleEditTag({tag})}>edit</span>
                        </li>
                        )
                    })
                }
            </ul>
            {
                (isEditTag && tagToEdit) && <EditTags tag={tagToEdit} />
            }
        </div>
    )
} 