import { useEffect, useMemo, useState } from 'react';
import '../../../styles/tablero/tagsSettings.scss';
import { BoardProps, ListProps, TargetProps, TagsProps } from '../../../types/boardProps';
import { EditTags } from './editTags';
import { useTagsStore } from '../../../store/tagsStore';

interface TagsSettings {
    board: BoardProps
    list: ListProps
    target: TargetProps
    closeTagsSettings: () => void
}

export const Tags: React.FC<TagsSettings> = ({ board, list, target, closeTagsSettings }) => {
    const { tags, setTagUsage, setUpdateTag } = useTagsStore();
    const [isEditTag, setIsEditTag] = useState(false);
    const [isCreateTag, setIsCreateTag] = useState(false);
    const [tagToEdit, setTagToEdit] = useState<TagsProps>();
    const [inputValue, setInputValuet] = useState('');
    const [limitTags, setLimitTags] = useState(5);

    const onChangeCheckbox = (prop: string) => {
        const idBoard = board.idBoard;
        const idList = list.idList;
        const idTarget = target.idTarget;
        const idTag = prop;
        setTagUsage({idBoard, idList, idTarget, idTag});
    }

    const openInterfaceToEditTag = ({tag}:{tag: TagsProps}) => {
        setIsEditTag(true);
        setTagToEdit(tag);
    }

    const isActive = ({tag}: {tag: TagsProps}) => {
        return tag.targetsThatUseIt.some((t) =>
                t.idBoard === board.idBoard && t.idList === list.idList && t.idTarget === target.idTarget ?
                true :
                false
            )
    }

    const tagsFilter = useMemo(() => {
        if (inputValue === '') return tags;
        return tags.filter(tag => tag.nameTag.toLowerCase().includes(inputValue.toLowerCase()));
    }, [inputValue, tags, limitTags]);

    const closeAll  = () => {
        closeTagsSettings();
        setIsEditTag(false);
        setIsCreateTag(false);
    }

    return (
        <div className='container_tags_settings'>
            {
                !isEditTag && (
                    <div className='tags_settings'>
                        <header className='tags_settings_header'>
                            <div></div>
                            <span>Etiquetas</span>
                            <button onClick={closeTagsSettings}>X</button>
                        </header>

                        <input
                        className='input_search_tags'
                        type="text"
                        value={inputValue}
                        placeholder='buscar etiquetas...'
                        onChange={(e) => setInputValuet(e.target.value)} />

                        <div className='container_tags'>
                            <span>Etiquetas</span>
                            <ul>
                                {
                                    tagsFilter.slice(0, limitTags).map((tag) => {
                                        return (
                                        <li key={tag.idTag}>
                                            <input type='checkbox' checked={isActive({tag})} onChange={() => onChangeCheckbox(tag.idTag)} />
                                            <div style={{backgroundColor: tag.color}}>{tag.nameTag}</div>
                                            <span onClick={() => openInterfaceToEditTag({tag})}>edit</span>
                                        </li>
                                        )
                                    })
                                }
                            </ul>
                            <footer>
                                {
                                    limitTags <= tagsFilter.length && (
                                        <button className='btn_see_more_tags' onClick={() => setLimitTags(prevState => prevState + 5)}>
                                            Ver más etiquetas...
                                        </button>
                                    )
                                }
                                <button onClick={() => setIsCreateTag(true)}>
                                    Crear etiqueta
                                </button>
                            </footer>
                        </div>
                    </div>
                )
            }
            {
                (isEditTag && tagToEdit) && (
                    <EditTags
                    key={`edit${tagToEdit.idTag}`}
                        titleAction='Editar'
                        closeComponent={() => setIsEditTag(false)}
                        closeAll={closeAll}
                        tag={tagToEdit}
                        />
                )
            }
            {
                isCreateTag && (
                    <EditTags
                        key={'create-tag'}
                        titleAction='Crear'
                        closeComponent={() => setIsCreateTag(false)}
                        closeAll={closeAll}
                        idBoard={board.idBoard}
                        idList={list.idList}
                        idTarget={target.idTarget}
                        />
                )
            }
        </div>
    )
}

