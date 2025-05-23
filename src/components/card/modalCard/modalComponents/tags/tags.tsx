import React, { useMemo, useState } from 'react';
import '../../../../../styles/components/card/modalCard/modalComponents/tags/tags.scss';
import { BoardProps, ListProps, CardProps, TagsProps } from '../../../../../types/boardProps';
import { EditTags } from './editTags';
import { useTagsStore } from '../../../../../store/tagsStore';
import { useTagsService } from '../../../../../services/tagsServices';
import { useAuthContext } from '../../../../../customHooks/useAuthContext';
import { updateStateTag } from '../../../../../services/firebase/updateData/updateTags';

// import { FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';
// import { FaRegEdit } from "react-icons/fa";
// import { Checkbox } from '@mui/material'; 
// import { LuPinOff } from "react-icons/lu";
import { BsPinFill } from "react-icons/bs";

import { betterColorText } from '../../../../../utils/tagsColors';
import { MdEdit } from "react-icons/md";

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
    console.log('se ejecutó onChange')

    if (userAuth) {
      updateStateTag({
        idTag,
        idBoard: board.idBoard,
        idList: list.idList,
        idCard
      });
    };

    tagsServices((tags) => tags.map((tag) => 
      tag.idTag === idTag 
      ? { ...tag,
        cardsThatUseIt: tag.cardsThatUseIt.some(card => card.idCard === idCard)
        ? tag.cardsThatUseIt.filter(card => 
            card.idCard !== idCard) //Si filtras con !== idBoard y !== idList puedes borrar referencias de más
        : [...tag.cardsThatUseIt, {idBoard: board.idBoard, idList: list.idList, idCard}]
      }
      :
      tag
    ));
  };

  const openInterfaceToEditTag = ({tag}:{tag: TagsProps}) => {
    setIsEditTag(true);
    setTagToEdit(tag);
  }

  const isActive = ({tag}: {tag: TagsProps}) => tag.cardsThatUseIt.some((t) =>
    t.idCard === card.idCard
  )

  const tagsFilter = useMemo(() => {
    if (inputValue === '') return tags;
    return tags.filter(tag => tag.nameTag.toLowerCase().includes(inputValue.toLowerCase()));
  }, [inputValue, tags, limitTagsToShow]);

  const closeAll  = () => {
    closeTagsSettings();
    setIsEditTag(false);
    setIsCreateTag(false);
  }

  // const hexToRgb = (hex: string) => {
  //   const bigint = parseInt(hex.slice(1), 16);
  //   return `rgb(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, .6)`;
  // }

  return (
    
    <div className='container_tags_settings'>
      {
        !isEditTag && (
          
          <div 
            style={{
              // background: hexToRgb(list.colorList)
              // background: `linear-gradient(135deg, rgba(255, 255, 255, .05) 0%, ${hexToRgb(list.colorList)} 100%)`
            }}
            className='tags_settings'
          >
            <header className='tags_settings_header'>
              {/* <span></span> */}
              {/* <h1 className='inter_title'>
                Etiquetas
              </h1> */}
              <button onClick={closeTagsSettings}>
                <IoMdClose />
              </button>
            </header>
            
            {/* <label>Filtra</label> */}
            <input
              className='input_search_tags roboto'
              type="text"
              value={inputValue}
              placeholder='buscar etiquetas...'
              onChange={(e) => setInputValuet(e.target.value)} 
            />

            <div className='container_tags'>
              <h2 className='roboto'>Etiquetas</h2>
                <ul>
                  {
                    tagsFilter.slice(0, limitTagsToShow).map((tag) => {
                      return (
                      <li key={tag.idTag} style={{backgroundColor: tag.color}}>     
                        <div className='container_icon_edit_and_nametag'>
                          <MdEdit 
                            onClick={() => openInterfaceToEditTag({tag})}
                            className='icon_edit_tag' 
                          />
                          <span style={{color: betterColorText(tag.color)}}>{tag.nameTag}</span>
                        </div>
                        <input 
                          id={`updatedTag_${tag.idTag}`}
                          type='checkbox'
                          style={{display: 'none'}}
                          onChange={() => onChangeCheckbox(tag.idTag)}
                        />
                        <label style={{backgroundColor: tag.color}} htmlFor={`updatedTag_${tag.idTag}`}>
                          {isActive({tag}) ? 
                          <BsPinFill className='pin_active' /> : 
                          <span className='fake_input'>
                            {/* <BsPinFill className='pin_hover' /> */}
                          </span>
                          }
                        </label>
                      </li>
                      )
                    })
                  }
                </ul>
                <footer>
                  {
                    limitTagsToShow < tagsFilter.length && (
                      <button 
                        className='btn_see_more_tags roboto_hard' 
                        onClick={() => setLimitTagsToShow(prevState => prevState + 5)}
                      >
                        ver más etiquetas...
                      </button>
                    )
                  }
                  {
                    limitTagsToShow > 5 && (
                      <button
                        className='btn_see_fewer_tags roboto_hard'
                        onClick={() => setLimitTagsToShow(prevState => prevState - 5)}
                      >
                        ver menos etiquetas
                      </button>
                    )
                  }
                  <button className='roboto_hard' onClick={() => setIsCreateTag(true)}>
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
            list={list}
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
            list={list}
            idCard={card.idCard}
          />
        )
      }
      </div>
      
  )
}

