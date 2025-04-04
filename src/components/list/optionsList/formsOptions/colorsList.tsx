import { useState } from 'react';
import '../../../../styles/components/list/optionsList/formsOptions/colorsToList.scss';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ListProps } from '../../../../types/boardProps';
import { useListsServices } from '../../../../services/listsServices';
import { useAuthContext } from '../../../../customHooks/useAuthContext';
import { updateColorListFirebase } from '../../../../services/firebase/updateData/updateLists';

interface ColorsToListComponentProps {
  idBoard: string
  list: ListProps
}

// #252526 gris de siempre
// #2c2c2c Gris acero
const listColors = [
  "#252526", // Gris acero
  "#1E3A8A", // Azul noche
  "#1FAA59", // Verde neón tenue
  "#5B21B6", // Púrpura intenso
  "#D97706", // Naranja quemado
  "#0EA5E9", // Cyan eléctrico
  "#991B1B", // Rojo oscuro
  "#B88D4B", // Dorado tenue
  "#4A051C", // Vino oscuro
  "#0F766E", // Turquesa apagado
  "#7C3AED", // Lavanda oscura
  "#374151", // Gris humo
  "#EAB308", // Amarillo mostaza
  "#BE185D", // Rosa fucsia apagado
  "#065F46"  // Verde bosque
];

export const ColorsToList: React.FC<ColorsToListComponentProps> = ({idBoard, list}) => {
    const { listsService } = useListsServices();
    const [colorsWrapper, setColorsWrappers] = useState(true);              //COLORS WRAPPER
    const idList = list.idList;
    const { userAuth } = useAuthContext();

  const changeColorList = ({idBoard, idList, color}: {idBoard: string, idList: string, color: string}) => {
    listsService({
      updateFn: (state) => state.map((listGroup) => 
      listGroup.idBoard === idBoard ?
      { ...listGroup, lists: listGroup.lists.map((list) => 
        list.idList === idList ? 
        { ...list, colorList: color } 
        : 
        list
      )} 
      :
      listGroup
      )
    });

    if (userAuth) {
      updateColorListFirebase({idBoard, idList, color});
    }
  }

  return (
    <div className='container_change_bg_list'>                                                      {/* CHANGE COLOR CONTAINER*/}
      <button className='btn_wrapper_colors' onClick={() => setColorsWrappers(!colorsWrapper)}>
        <span>Cambiar color de la lista</span> {colorsWrapper ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <div className={`colors_wrapper_${colorsWrapper ? 'show' : 'hidden'}`}>
        {
          listColors.map((color) => (                           
            <button 
              className={`btn_color ${color === list.colorList ? 'current_color' : ''}`} 
              onClick={() => changeColorList({idBoard, idList, color})}                     //<-- CAMBIAR COLOR
              key={color}
            >        {/* QUIZÁ HAYA DUPLICADO DE KEYS */}
              <span style={{backgroundColor: color}} />
            </button>
          ))
        }
      </div>
    </div>
  )
}