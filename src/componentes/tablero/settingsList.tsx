import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import '../../styles/tablero/settingsList.scss';
import { BtnAdd } from "./btnAgregar";
import { useBoardsStore } from "../../store/boardsStore";
import { ListProps } from "../../types/boardProps";
import { FormCopyElement } from "./copiarElemento";
import { FormMoveList } from "./list/formMoverLista";

interface SettingsListProps {
    idBoard: string
    list: ListProps
}

const useSettingsList = () => {
    const { boards, deleteList, setColorList, setLists } = useBoardsStore();

    const deleteListt = ({idBoard, idList}: {idBoard: string, idList: string}) => {
        deleteList({idBoard, idList});
    }

    const changeColorList = ({idBoard, idList, color}: {idBoard: string, idList: string, color: string}) => {
        setColorList({idBoard, idList, color});
    }

    const copyList = ({idBoard, list, inputText}: {idBoard: string, list: ListProps, inputText: string}) => {
        const idListToCopy = list.idList;  //id a buscar
        const boardIndex = boards.findIndex(board => board.idBoard === idBoard);
        const indexListToCopy = boards[boardIndex].lists.findIndex(list => list.idList === idListToCopy);

        const listCopy = {...list, 
            idList: (Date.now() + list.nameList).toString(),
            nameList: inputText
        }

        const LISTS = [...boards[boardIndex].lists];
        let lists: ListProps[] = [];

        for (let i = 0; i < LISTS.length; i++) {
            lists.push(LISTS[i]);
            if (i === indexListToCopy) {
                lists.push(listCopy);
            }
        }
        setLists({idBoard, lists})
    }

    const moveListt = ({idBoard, list, position}: {idBoard: string, list: ListProps, position: number}) => {
        const boardIndex = boards.findIndex(board => board.idBoard === idBoard);

        let lists: ListProps[] = []

        for (let i = 0; i < boards[boardIndex].lists.length; i++) { 
            let LIST: ListProps = {idList: '', nameList: '', colorList: '', targets: []};
            let index: number | null = null;

            for (let j = 0; j < boards[boardIndex].lists.length; j++) {
                if (j === position) {
                    LIST = boards[boardIndex].lists[j];
                }

                if (boards[boardIndex].lists[j].idList === list.idList) {
                    index = j;
                }
            }

            if (i === position) {
                lists.push(list)
                continue
            }

            if (i === index) {
                lists.push(LIST)
                continue
            }

            lists.push(boards[boardIndex].lists[i]);
            
        }

        setLists({idBoard, lists});
    }

    const moveList = ({idBoard, list, position}: {idBoard: string, list: ListProps, position: number}) => {
        const indexBoard = boards.findIndex(board => board.idBoard === idBoard);

        let INDEX: number;
        let LIST: ListProps;

        for (let i = 0; i < boards[indexBoard].lists.length; i++) {
            if (boards[indexBoard].lists[i].idList === list.idList) {
                INDEX = i
            }
            if (i === position) {
                LIST = boards[indexBoard].lists[i];
            }
        }

        const lists = boards[indexBoard].lists.map((l, index) => {
            if (index === position) {
                return list
            }

            if (index === INDEX) {
                return LIST
            }

            return l
        })

        setLists({idBoard, lists});
    }

    return { deleteListt, changeColorList, copyList, moveListt, moveList, setLists, boards };
}

export const SettingsList: React.FC<SettingsListProps> = ({ idBoard, list }) => {
    const { deleteListt, changeColorList, copyList, moveList, boards } = useSettingsList();
    const [isBtnCopyClicked, setIsBtnCopyClicked] = useState(false);
    const [isOptionsActive, setIsOptionsActive] = useState(false);
    const [colorsWrapper, setColorsWrappers] = useState(true);
    const [showFormMoveList, setShowFormMoveList] = useState(false);

    const idList = list.idList;


    const colors = ["brown", "blue", "green", "yellow", "black", "white", "orange", "purple", "gray", "pink"];

    const handleCopyList = () => {
        setIsBtnCopyClicked(true); //para activar interfaz necesito ocultar los demas botones
        setIsOptionsActive(false);
    }

    const callbackCopyList = (inputText: string) => {
        copyList({idBoard, list, inputText});
        setIsBtnCopyClicked(false);
        setIsOptionsActive(true)
    }

    const handleMoveList = () => {
        setShowFormMoveList(true);
        setIsOptionsActive(false);
    }

    const closeFormMoveList = () => {
        setShowFormMoveList(false);
        setIsOptionsActive(true);
    }

    const callbackMoveList = (position: number) => {
        console.log('se ejecuto el callback', position)
        moveList({idBoard, list, position});
        setIsOptionsActive(true);
        setShowFormMoveList(false);
    }

    return (
        <div className='options' onPointerDown={(e) => e.stopPropagation()}>       
            <button onClick={() => setIsOptionsActive(true)} className='btn_active_options'>
                <PiDotsThreeOutlineFill className='icon_options_list' />
            </button>

            {isBtnCopyClicked && (           //Mostrar interfaz para copiar lista
                <FormCopyElement
                 closeForm={() => {setIsBtnCopyClicked(false), setIsOptionsActive(true)}} 
                 callback={callbackCopyList}
                 nameElement='lista' 
                 value={list.nameList}
                 />
            )}

            {
                showFormMoveList && (
                    <FormMoveList 
                     idBoard={idBoard} 
                     list={list} 
                     closeForm={closeFormMoveList} 
                     callback={callbackMoveList} />
                )
            }

            <div className={`settings_list_${isOptionsActive ? 'show' : 'hidden'}`}>
                <div className='header_settings_list'>
                    <IoMdClose className='icon-close'                                       //Active options
                     onClick={() => setIsOptionsActive(false)} 
                     />
                </div>

                <button className='btn_setting_list' onClick={handleCopyList}>             {/* COPY LIST*/}
                    Copiar lista
                </button>

                <button className='btn_setting_list' onClick={handleMoveList}>
                    Mover lista
                </button>

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

                <button className='btn_setting_list' onClick={() => deleteListt({idBoard, idList})}>Eliminar lista</button>   {/* REMOVE LIST */}
            </div>
        </div>
    )
}