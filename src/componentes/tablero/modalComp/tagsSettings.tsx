import { useState } from 'react';
import '../../../styles/tablero/tagsSettings.scss';

interface TagsSettingsProps {
    tags: {color: string, active: boolean, name: string}[]
}

export const TagSettings: React.FC<TagsSettingsProps> = ({ tags }) => {

    const [myTags, setMyTags] = useState(tags);

    return (
        <div className='tags_settings'>
            <header className='tags_settings_header'>
                <div></div>
                <span>Tags</span>
                <button>X</button>
            </header>
            <input type="text" placeholder='buscar etiquetas...' />
            <span>Etiquetas</span>
            <ul>
                {
                    myTags.map((tag) => {
                        return (
                        <li key={tag.name}>
                            <input type='checkbox' checked={tag.active} />
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