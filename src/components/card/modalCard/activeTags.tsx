import '../../../styles/components/card/modalCard/modalComponents/tags/activeTags.scss';
import React, { useEffect, useState } from "react";
import { BoardProps, CardProps, ListProps, TagsProps } from "../../../types/boardProps";
import { useTagsStore } from "../../../store/tagsStore";
import { Tags } from "./modalComponents/tags/tags";
// import { CiSquarePlus } from "react-icons/ci";
import { RiStickyNoteAddLine } from "react-icons/ri";

import { FaSquarePlus } from "react-icons/fa6";
import { BsPinAngleFill } from "react-icons/bs";

import { betterColorText } from '../../../utils/tagsColors';

interface Props {
    board: BoardProps
    list: ListProps
    card: CardProps
}

export const ActiveTags: React.FC<Props> = ({board, list, card}) => {
    const { tags } = useTagsStore();
    const [showTags, setShowTags] = useState(false);
    const [currentActiveTags, setCurrentActiveTags] = useState<TagsProps[]>([]);
    
	useEffect(() => {
		const activeTags: TagsProps[] = [];

		tags.map((tag) => tag.cardsThatUseIt.some((c) => 
			// c.idBoard === board.idBoard && 
			// c.idList === list.idList && 
			c.idCard === card.idCard 
			?
			activeTags.push(tag) : 
			null
			)
		)

		setCurrentActiveTags(activeTags);
	}, [tags]);
    
	return (
		<>
			<div className='tags_container'>
				<h2 className='roboto'>Etiquetas activas</h2>
				{
					currentActiveTags.length > 0 
					?
					(
						<div className='tags'>           {/* PUEDES Y DEBES SEPARAR EL COMPONENTE DE ETIQUETAS PARA QUE ESTÉ MAS LIMPIO */}
							
							{
								currentActiveTags.map((tag) => 
								<button 
									key={tag.idTag} 
									style={{backgroundColor: tag.color}} 
									className='tag_active'
								>
                  <BsPinAngleFill  className='pinAngle' />
									<span className='inter_subtitle' style={{color: betterColorText(tag.color)}}>{tag.nameTag}</span>
								</button>)
							}

							<button title='agregar etiqueta' className='btn_add_tag' onClick={() => setShowTags(true)}>
								<RiStickyNoteAddLine className='icon_add_tag' />
							</button>
						</div>
					)
					:
					<div className='container_no_tags'>
						<span className='no_tags_text roboto_light'>No hay etiquetas para esta tarjeta..</span>
						<button className='btn_add_tag' onClick={() => setShowTags(true)}>
							<RiStickyNoteAddLine className='icon_add_tag' />
						</button>             {/*PARA ACTIVAR EL MODAL*/}
					</div>
				}
			</div>
      
			{
				showTags && (
					<Tags 
						board={board} 
						list={list} 
						card={card} 
						closeTagsSettings={() => setShowTags(false)}
					/>
				)
			}
		</>
	)
}