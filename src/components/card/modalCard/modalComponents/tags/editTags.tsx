import '../../../../../styles/components/card/modalCard/modalComponents/tags/editTag.scss';
import React, { useEffect, useState } from "react";
import { ListProps, TagsProps } from '../../../../../types/boardProps';
import { useTagsService } from '../../../../../services/tagsServices';
import { createTagFirebase, deleteTagFirebase, updateTag } from '../../../../../services/firebase/updateData/updateTags';
import { useAuthContext } from '../../../../../customHooks/useAuthContext';

import { IoMdClose } from 'react-icons/io';
import { FaArrowLeft } from "react-icons/fa";
import { betterColorText } from '../../../../../utils/tagsColors';

// const colors = [
//   "#E63946", "#F4A261", "#2A9D8F", "#264653", "blue",
//   "#F39C12", "#16A085", "#2980B9", "#D35400", "#C0392B",
//   "#3498DB", "#27AE60", "#8E44AD", "#F1C40F", "#2C3E50",
//   "#E67E22", "#1ABC9C", "#9B59B6", "#34495E", "#E74C3C"
// ];

// const colors = [
//   "#D32F2F", // Alta prioridad
//   "#F57C00", // Por hacer
//   "#0288D1", // En progreso
//   "#7B1FA2", // Revisión necesaria
//   "#388E3C", // Aprobado
//   "#C2185B", // Rechazado
//   "#455A64", // Bajo seguimiento
//   "#AFB42B", // Completado
//   "#1976D2", // Bloqueado
//   "#616161"  // Pendiente de aprobación
// ];

const colors = [
  "#D32F2F", // Alta prioridad
  "#F57C00", // Por hacer
  "#0288D1", // En progreso
  "#7B1FA2", // Revisión necesaria
  "#388E3C", // Aprobado
  "#C2185B", // Rechazado
  "#455A64", // Bajo seguimiento
  "#AFB42B", // Completado
  "#1976D2", // Bloqueado
  "#616161", // Pendiente de aprobación
  "#E64A19", // Urgente
  "#009688", // Idea
  "#5D4037", // Esperando feedback
  "#673AB7", // Investigación
  "#FBC02D", // Advertencia
  "#9C27B0", // Concepto
  "#3F51B5", // Revisión interna
  "#8BC34A", // Bajo control
  "#E91E63", // Problema detectado
  "#00BCD4"  // Oportunidad
];

interface EditTagsProps {
  idBoard?: string
  list?: ListProps
  idCard?: string
  tag?: TagsProps
  titleAction: 'Editar' | 'Crear'
  closeComponent: () => void
  closeAll: () => void
}

export const EditTags: React.FC<EditTagsProps> = ({idBoard, list, idCard, tag, titleAction, closeAll, closeComponent}) => {
  // const { setUpdateTag, setCreateTag, setRemoveTag } = useTagsStore();
  const [nameTag, setNameTag] = useState('');
  const [color, setColor] = useState('');
  const { tagsServices } = useTagsService();
  const { userAuth } = useAuthContext();

  useEffect(() => {        //si es para editar una tag existente se cargan sus respectivas caracteristicas(color, nameTag)
    if (!tag) return;
    setNameTag(tag.nameTag);
    setColor(tag.color);
  }, []);

  const handleSaveChanges = () => {
    if (!tag) return
    const idTag = tag.idTag;
    if (userAuth) {
      updateTag({
        idTag,
        name: !(nameTag === tag.nameTag) ? nameTag : undefined,
        color: !(color === tag.color) ? color : undefined
      });
    }
    tagsServices((tags) => tags.map((tag) => 
      tag.idTag === idTag ?
      { 
        ...tag,
        nameTag: nameTag,
        color: color
      }
      :
      tag
    ));
    closeComponent();
  }

  const createTag = () => {
    if (!idBoard || !list || !idCard) return
    const newTag: TagsProps = {
      idTag: (idCard + list.idList + idBoard + Date.now()).toString(), 
      color, 
      nameTag,
      cardsThatUseIt: [
        {idBoard, idList: list.idList, idCard}
      ]
    };

    if (userAuth) {
      createTagFirebase({tag: newTag});
    }
    tagsServices((tags) => [newTag, ...tags]);
    closeComponent();
  }

  const removeTag = () => {
    if (!tag) return
    const idTag = tag.idTag;
    if (userAuth) {
      deleteTagFirebase(idTag);
    }
    // setRemoveTag(idTag);        //falta agregar modal para confirmar eliminacion de una etiqueta
    tagsServices((tags) => tags.filter(tag => tag.idTag !== idTag));
    closeComponent();
  }

  useEffect(() => {
    console.log('color text', betterColorText(color))
  }, []);

  const hexToRgb = (hex: string, opacity: number) => {
    const bigint = parseInt(hex.slice(1), 16);
    return `rgb(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, ${opacity})`;
  }

  return (
    <div   
      className='container_edit_or_create_tag'
      style={{
        background: list?.colorList
      // backgroundColor: list?.colorList ? hexToRgb(list?.colorList, 0.6) : ''
      }}
      >
        <header>
          <button onClick={closeComponent} >
            <FaArrowLeft />
          </button>
          <span className='inter_title'>{titleAction} etiqueta</span>
          <button onClick={closeAll}>
            <IoMdClose />
          </button>
        </header>

        <main>
          <article className='current_tag_to_edit'>
            <div 
              style={{ 
              backgroundColor: color,
              color: betterColorText(color)
              }} 
              >
              {nameTag}
            </div>
          </article>
          <article className='input_to_edit_tag'>
            <p>Titulo</p>
            <input type='text' value={nameTag} onChange={(e) => setNameTag(e.target.value)} />
          </article>
            <article className='tag_colors'>
              <p>Selecciona un color</p>
              <div>
                {
                colors.map((availableColor) => (
                  <button 
                  key={availableColor}
                  onClick={() => setColor(availableColor)}
                  style={{backgroundColor: availableColor, border: availableColor === color ? '2px solid' : 'none'}} 
                  />
                  )
                )
                }
              </div>
            </article>
            {/* <article className='article_remove_color'>
              <button onClick={() => setColor('grey')}>Quitar color</button>
            </article> */}
            <article className='btns_actions'>
              <button 
                onClick={titleAction === 'Editar' ? handleSaveChanges : createTag}
                >
                {titleAction === 'Editar' ? 'Guardar' : 'Crear'}
              </button>
              {titleAction === 'Editar' && <button onClick={removeTag}>Eliminar</button>}
            </article>
        </main>
      </div>
  )
}