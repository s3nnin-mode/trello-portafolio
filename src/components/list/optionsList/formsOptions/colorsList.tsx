import { useState } from 'react';
import '../../../../styles/components/list/optionsList/formsOptions/colorsToList.scss';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ListProps } from '../../../../types/boardProps';
import { useListsServices } from '../../../../services/listsServices';

interface ColorsToListComponentProps {
    idBoard: string
    list: ListProps
}

export const ColorsToList: React.FC<ColorsToListComponentProps> = ({idBoard, list}) => {
    const { listsService } = useListsServices();
    const [colorsWrapper, setColorsWrappers] = useState(true);              //COLORS WRAPPER
    const colors = ["brown", "blue", "green", "yellow", "black", "white", "orange", "purple", "gray", "pink"];
    const idList = list.idList;

    const changeColorList = ({idBoard, idList, color}: {idBoard: string, idList: string, color: string}) => 
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
    })

     return (
        <div className='container_change_bg_list'>                                                      {/* CHANGE COLOR CONTAINER*/}
            <button className='btn_wrapper_colors' onClick={() => setColorsWrappers(!colorsWrapper)}>
                <span>Cambiar color de la lista</span> {colorsWrapper ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div className={`colors_wrapper_${colorsWrapper ? 'show' : 'hidden'}`}>
                {
                    colors.map((color) => (                           
                        <button className={`btn_color ${color === list.colorList ? 'current_color' : ''}`} 
                            onClick={() => changeColorList({idBoard, idList, color})}                     //<-- CAMBIAR COLOR
                            key={color}>        {/* QUIZÁ HAYA DUPLICADO DE KEYS */}
                            <span style={{backgroundColor: color}}></span>
                        </button>
                    ))
                }
            </div>
        </div>
     )
}