import { useEffect, useState } from "react";
import '../../styles/tablero/modal.scss';
import { TagSettings } from "./modalComp/tagsSettings";

interface ModalProps {
    nameTarget: string
    nameList: string
    tags: {color: string, active: boolean, nameTag: string}[];
    handleClick: () => void
}

interface TagsProps {
    color: string
    active: boolean
    name: string
}

export const Modal: React.FC<ModalProps> = ({nameList, nameTarget, tags, handleClick}) => {

    // const [myTags, setMyTags] = useState<TagsProps[]>(tags);
    const [showTags, setShowTags] = useState(false);

    // useEffect(() => {
    //     setMyTags(tags);
    // });

    return (
        <div className='modal_show'>
            <header>
                <div>
                    <h2>Target: {nameTarget}</h2>
                    <p>en la lista {nameList}</p>
                </div>
                <button onClick={handleClick}>X</button>
            </header>
            <div className='modal_content_container'>
                <div className='modal_content'>
                    <div className='tags_container'>
                        <h3>Tags</h3>
                        <div className='tags'>

                            {tags.map((tag) => {
                                return tag.active ? <button key={tag.nameTag} style={{backgroundColor: tag.color}}>{tag.nameTag}</button> : ''
                            })
                            }
                            <button className='btn_add_tag' onClick={() => setShowTags(true)}>+</button>
                            {showTags && <TagSettings tags={tags} closeTagsSettings={() => setShowTags(false)} />}
                        </div>
                    </div>                   
                </div>
                <div className='sidebar_modal'>
                    <button>Tags</button>
                    <button>Editar</button>
                    <button>Eliminar</button>
                </div> 
            </div>
        </div>
    )
}