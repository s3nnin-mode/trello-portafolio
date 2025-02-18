import { useState } from "react";
import { BoardProps, CardProps, ListProps } from "../../../../../types/boardProps";
import { Tags } from "../tags/tags";

interface Props {
    board: BoardProps
    list: ListProps
    card: CardProps
}

export const BtnOpenTags: React.FC<Props> = ({board, list, card}) => {
    const [showTags, setShowTags] = useState(false);

    return (
        <div>
            <button 
            className='btn_modal_sidebar'
            onClick={() => setShowTags(true)}>Tags</button>
            {
                showTags && (
                    <Tags 
                    board={board} 
                    list={list} 
                    card={card}
                    closeTagsSettings={() => setShowTags(false)} />
                )
            }
        </div>
    )
}