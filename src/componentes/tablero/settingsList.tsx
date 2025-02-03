import { useState } from "react";
import '../../styles/tablero/settingsList.scss';

//REACT-ICONS
import { IoMdClose } from "react-icons/io";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
//COMPONENTS
import { FormCopyElement } from "./copiarElemento";
import { FormMoveList } from "./list/formMoverLista";
//STORES
import { useListsStore } from "../../store/listsStore";
import { useBoardsStoree } from "../../store/boardsStoredos";
//TYPES
import { ListProps } from "../../types/boardProps";

interface SettingsListProps {
    idBoard: string
    list: ListProps
}

const useSettingsList = () => {
    const { boards } = useBoardsStoree();
    const { deleteList, setColorList, setLists, listsGroup } = useListsStore();
    const deleteListt = ({idBoard, idList}: {idBoard: string, idList: string}) => {
        deleteList({idBoard, idList});
    }

    const changeColorList = ({idBoard, idList, color}: {idBoard: string, idList: string, color: string}) => {
        setColorList({idBoard, idList, color});
    }

    const copyList = ({idBoard, list, inputText}: {idBoard: string, list: ListProps, inputText: string}) => {
        const idListToCopy = list.idList;  //id a buscar
        // const boardIndex = boards.findIndex(board => board.idBoard === idBoard);
        // const indexListToCopy = boards[boardIndex].lists.findIndex(list => list.idList === idListToCopy);
        const indexListGroup = listsGroup.findIndex(listGroup => listGroup.idBoard === idBoard);
        const indexListToCopy = listsGroup[indexListGroup].lists.findIndex(list => list.idList === idListToCopy);

        const listCopy = {...list, 
            idList: (Date.now() + list.nameList).toString(),
            nameList: inputText
        }

        // const LISTS = [...boards[boardIndex].lists];
        const LISTS = [...listsGroup[indexListGroup].lists];
        let lists: ListProps[] = [];

        for (let i = 0; i < LISTS.length; i++) {
            lists.push(LISTS[i]);
            if (i === indexListToCopy) {
                lists.push(listCopy);
            }
        }
        setLists({idBoard, lists})
    }

    const moveList = ({idBoard, list, position}: {idBoard: string, list: ListProps, position: number}) => {
        const indexListGroup = listsGroup.findIndex(listGroup => listGroup.idBoard === idBoard);

        let INDEX: number;
        let LIST: ListProps;

        for (let i = 0; i < listsGroup[indexListGroup].lists.length; i++) {
            if (listsGroup[indexListGroup].lists[i].idList === list.idList) {
                INDEX = i
            }
            if (i === position) {
                LIST = listsGroup[indexListGroup].lists[i];
            }
        }

        const lists = listsGroup[indexListGroup].lists.map((l, index) => {
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

    return { deleteListt, changeColorList, copyList, moveList, setLists, boards };
}

export const useSettingsModalList = () => {
    const [isModalOptionsActive, setIsModalOptionsActive] = useState(false);          //BTN OPEN MODAL OPTIONS

    return { isModalOptionsActive, setIsModalOptionsActive }
}

const useCopyList = () => {
    const { copyList } = useSettingsList();
    const { setIsModalOptionsActive } = useSettingsModalList();

    const [showFormCopyList, setShowFormCopyList] = useState(false);        //BTN COPY LIST

    const handleCopyList = () => {
        setShowFormCopyList(true); //para activar interfaz necesito ocultar los demas botones
        setIsModalOptionsActive(false);
    }

    const callbackCopyList = ({idBoard, list, inputText}: {idBoard: string, list: ListProps, inputText: string}) => {
        copyList({idBoard, list, inputText});
        setShowFormCopyList(false);
        setIsModalOptionsActive(true)
    }

    return { showFormCopyList, setShowFormCopyList, handleCopyList, callbackCopyList }
}

export const SettingsList: React.FC<SettingsListProps> = ({ idBoard, list }) => {
    const { deleteListt, changeColorList, moveList } = useSettingsList();

    const { showFormCopyList, handleCopyList, callbackCopyList, setShowFormCopyList } = useCopyList();
    const { isModalOptionsActive, setIsModalOptionsActive } = useSettingsModalList();

    const [colorsWrapper, setColorsWrappers] = useState(true);              //COLORS WRAPPER
    const [showFormMoveList, setShowFormMoveList] = useState(false);        //FORM MOVE LIST

    const idList = list.idList;
    const colors = ["brown", "blue", "green", "yellow", "black", "white", "orange", "purple", "gray", "pink"];

    const handleMoveList = () => {
        setShowFormMoveList(true);
        setIsModalOptionsActive(false);
    }

    const closeFormMoveList = () => {
        setShowFormMoveList(false);
        setIsModalOptionsActive(true);
    }

    const callbackMoveList = (position: number) => {
        console.log('se ejecuto el callback', position)
        moveList({idBoard, list, position});
        setIsModalOptionsActive(true);
        setShowFormMoveList(false);
    }

    return (
        <div className='options' onPointerDown={(e) => e.stopPropagation()}>       
            <button onClick={() => setIsModalOptionsActive(true)} className='btn_active_options'>
                <PiDotsThreeOutlineFill className='icon_options_list' />
            </button>

            {showFormCopyList && (           //Mostrar interfaz para copiar lista
                <FormCopyElement
                 closeForm={() => {setShowFormCopyList(false), setIsModalOptionsActive(true)}} 
                 callback={(inputText) => callbackCopyList({idBoard, list, inputText})}
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

            <div className={`settings_list_${isModalOptionsActive ? 'show' : 'hidden'}`}>
                <div className='header_settings_list'>
                    <IoMdClose className='icon-close'                                       //Active options
                     onClick={() => setIsModalOptionsActive(false)} 
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