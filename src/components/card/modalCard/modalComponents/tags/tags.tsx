import { useMemo, useState } from 'react';
import '../../../../../styles/components/card/modalCard/modalComponents/tags/tags.scss';
import { BoardProps, ListProps, CardProps, TagsProps } from '../../../../../types/boardProps';
import { EditTags } from './editTags';
import { useTagsStore } from '../../../../../store/tagsStore';
import { useTagsService } from '../../../../../services/tagsServices';
import { useAuthContext } from '../../../../../customHooks/useAuthContext';
import { updateStateTag } from '../../../../../services/firebase/updateData/updateTags';

interface TagsSettings {
    board: BoardProps
    list: ListProps
    card: CardProps
    closeTagsSettings: () => void
}

export const Tags: React.FC<TagsSettings> = ({ board, list, card, closeTagsSettings }) => {
    const { tags } = useTagsStore();
    const [isEditTag, setIsEditTag] = useState(false);
    const [isCreateTag, setIsCreateTag] = useState(false);
    const [tagToEdit, setTagToEdit] = useState<TagsProps>();
    const [inputValue, setInputValuet] = useState('');
    const [limitTagsToShow, setLimitTagsToShow] = useState(5);
    const { tagsServices } = useTagsService();
    const { userAuth } = useAuthContext();
 
    const onChangeCheckbox = (prop: string) => {
        const idCard = card.idCard;
        const idTag = prop;

        if (userAuth) {
            updateStateTag({
                idTag,
                idBoard: board.idBoard,
                idList: list.idList,
                idCard: card.idCard
            })
        }

        tagsServices((tags) => tags.map((tag) => 
            tag.idTag === idTag 
            ?
            {
                ...tag,
                cardsThatUseIt: tag.cardsThatUseIt.some(card => 
                card.idBoard === board.idBoard && card.idList === list.idList && card.idCard === idCard) 
                ? 
                tag.cardsThatUseIt.filter(card => card.idBoard !== board.idBoard && card.idList !== list.idList && card.idCard !== idCard) 
                : 
                [...tag.cardsThatUseIt, {idBoard: board.idBoard, idList: list.idList, idCard}]
            }
            :
            tag
        ));
    };

    const openInterfaceToEditTag = ({tag}:{tag: TagsProps}) => {
        setIsEditTag(true);
        setTagToEdit(tag);
    }

    const isActive = ({tag}: {tag: TagsProps}) => {
        return tag.cardsThatUseIt.some((t) =>
                t.idBoard === board.idBoard && t.idList === list.idList && t.idCard === card.idCard ?
                true :
                false
            )
    }

    const tagsFilter = useMemo(() => {
        if (inputValue === '') return tags;
        return tags.filter(tag => tag.nameTag.toLowerCase().includes(inputValue.toLowerCase()));
    }, [inputValue, tags, limitTagsToShow]);

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
                                    tagsFilter.slice(0, limitTagsToShow).map((tag) => {
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
                                    limitTagsToShow < tagsFilter.length && (
                                        <button className='btn_see_more_tags' onClick={() => setLimitTagsToShow(prevState => prevState + 5)}>
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
                        idCard={card.idCard}
                        />
                )
            }
        </div>
    )
}

