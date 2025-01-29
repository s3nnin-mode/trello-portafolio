import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import '../../styles/tablero/settingsList.scss';
import { BtnAdd } from "./btnAgregar";
import { useBoardsStore } from "../../store/boardsStore";
import { ListProps } from "../../types/boardProps";

interface SettingsListProps {
    idBoard: string
    idList: string
    list: ListProps
}

const useSettingsList = () => {
    const { boards, deleteList, setColorList } = useBoardsStore();

    const deleteListt = ({idBoard, idList}: {idBoard: string, idList: string}) => {
        deleteList({idBoard, idList});
    }

    const changeColorList = ({idBoard, idList, color}: {idBoard: string, idList: string, color: string}) => {
        setColorList({idBoard, idList, color});
    }

    // const copyList = ({nameList, indexBoard, indexList}: {nameList: string, indexBoard: number, indexList: number}) => {
    //     const BOARDS = [...boards];

    //     const listToCopy = BOARDS[indexBoard].lists[indexList];
    //     listToCopy.nameList = nameList;                           //el usuario puede colocar otro nombre a la lista a copiar
    //     listToCopy.idList = (nameList + Date.now()).toString();  //copiamos todo lo de la lista excepto el id, se le da uno nuevo para no tener listas con id duplicados

    //     BOARDS[indexBoard].lists = [...BOARDS[indexBoard].lists, listToCopy];
    // }

    return { deleteListt, changeColorList, boards };
}

export const SettingsList: React.FC<SettingsListProps> = ({ idBoard, idList, list }) => {
    const { deleteListt, changeColorList, boards } = useSettingsList();
    const [isBtnCopyClicked, setIsBtnCopyClicked] = useState(false);
    const [isOptionsActive, setIsOptionsActive] = useState(false);
    const [colorsWrapper, setColorsWrappers] = useState(true);

    const colors = ["red", "blue", "green", "yellow", "black", "white", "orange", "purple", "gray", "pink"];

    const handleClick = () => {
        setIsBtnCopyClicked(true); //para activar interfaz necesito ocultar los demas botones
        setIsOptionsActive(false);
    }

    return (
        <div className='options'>       
            <button onClick={() => setIsOptionsActive(true)} className='btn_active_options'>
                <PiDotsThreeOutlineFill className='icon_options_list' />
            </button>

            <div className={`interfaze_copy_list_${isBtnCopyClicked ? 'show' : 'hidden'}`}>
                <div>
                <p>Copiar lista</p>
                <span onClick={() => setIsBtnCopyClicked(false)}>salir</span>
                </div>
                <input></input>
            </div>

            <div className={`settings_list_${isOptionsActive ? 'show' : 'hidden'}`}>
                <div className='header_settings_list'>
                    <IoMdClose className='icon-close' onClick={() => setIsOptionsActive(false)} />
                </div>

                <button className='btn_setting_list' onClick={() => setIsBtnCopyClicked(true)}>
                    Copiar lista
                </button>

                <div className='container_change_bg_list'>  {/* CHANGE COLOR */}
                    <button className='btn_wrapper_colors' onClick={() => setColorsWrappers(!colorsWrapper)}>
                        <span>Cambiar color de la lista</span> {colorsWrapper ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <div className={`colors_wrapper_${colorsWrapper ? 'show' : 'hidden'}`}>
                        {colors.map((color) => (
                            <button className={`btn_color ${color === list.colorList ? 'current_color' : ''}`} 
                                onClick={() => changeColorList({idBoard, idList, color})}
                                key={color}>        {/* QUIZÁ HAYA DUPLICADO DE KEYS */}
                                <span style={{backgroundColor: color}}></span>
                            </button>
                        )
                        )}
                    </div>
                </div>

                <button className='btn_setting_list' onClick={() => deleteListt({idBoard, idList})}>Eliminar lista</button>
            </div>
        </div>
    )
}