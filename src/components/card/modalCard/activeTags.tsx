import '../../../styles/components/card/modalCard/modalComponents/tags/activeTags.scss';
import React, { useEffect, useState } from "react";
import { BoardProps, CardProps, ListProps, TagsProps } from "../../../types/boardProps";
import { useTagsStore } from "../../../store/tagsStore";
import { Tags } from "./modalComponents/tags/tags";
import { CiSquarePlus } from "react-icons/ci";
import { FaSquarePlus } from "react-icons/fa6";

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

		tags.map((tag) => 
			tag.cardsThatUseIt.some((c) => 
			(c.idBoard === board.idBoard && c.idList === list.idList && c.idCard === card.idCard) ?
			activeTags.push(tag) : 
			null
			)
		)

		setCurrentActiveTags(activeTags);
	}, [tags]);
    
	return (
		<>
			<div className='tags_container'>
				<h5 className='inter_title'>Etiquetas activas</h5>
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
									{tag.nameTag}
								</button>)
							}
							<button className='btn_add_tag' onClick={() => setShowTags(true)}>
								<FaSquarePlus className='icon_add_tag' />
							</button>  {/*PARA ACTIVAR EL MODAL*/}
						</div>
					)
					:
					<>
						<span className='inter' style={{fontStyle: 'italic'}}>No hay etiquetas para esta tarjeta..</span>
						<button className='btn_add_tag' onClick={() => setShowTags(true)}>
							<FaSquarePlus className='icon_add_tag' />
							Agregar etiqueta
						</button>             {/*PARA ACTIVAR EL MODAL*/}
					</>
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