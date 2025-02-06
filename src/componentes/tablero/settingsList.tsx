import { useEffect, useState } from "react";
import '../../styles/tablero/settingsList.scss';

//REACT-ICONS
import { IoMdClose } from "react-icons/io";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
//COMPONENTS
import { FormCopyElement } from "./copiarElemento";
import { FormMoveList } from "./list/formMoverLista";
import { ColorsToList } from "./list/colorsList";
//STORES
import { useListsStore } from "../../store/listsStore";
import { useBoardsStoree } from "../../store/boardsStoredos";
//TYPES
import { ListProps } from "../../types/boardProps";
//HOOKS
import { useFormCopyList } from "../../customHooks/list/formCopyList";
import { useFormMoveList } from "../../customHooks/list/formMoveList";

interface SettingsListProps {
    idBoard: string
    list: ListProps
}

const useSettingsList = () => {
    const { boards } = useBoardsStoree();
    const { deleteList, setColorList, setLists } = useListsStore();

    const deleteListt = ({idBoard, idList}: {idBoard: string, idList: string}) => {
        deleteList({idBoard, idList});
    }

    return { deleteListt, setLists, boards };
}

export const useSettingsModalList = () => {
    const [isModalOptionsActive, setIsModalOptionsActive] = useState(false);          //modal OPTIONS
    return { isModalOptionsActive, setIsModalOptionsActive }
}

export const SettingsList: React.FC<SettingsListProps> = ({ idBoard, list }) => {
    const { deleteListt } = useSettingsList();
    const { isModalOptionsActive, setIsModalOptionsActive} = useSettingsModalList();
    const { showFormCopyList, openFormCopyList, closeFormCopyList, closeAllFormCopy, callbackHandleCopyList } = useFormCopyList({ setIsModalOptionsActive });
    const { showFormMoveList, openFormMoveList, closeFormMoveList, closeAllMoveList, callbackHandleMoveList } = useFormMoveList({setIsModalOptionsActive});

    const idList = list.idList;

    return (
        <div className='options' onPointerDown={(e) => e.stopPropagation()}>       
            <button onClick={() => setIsModalOptionsActive(true)} className='btn_active_options'>
                <PiDotsThreeOutlineFill className='icon_options_list' />
            </button>

            <div className={`settings_list_${isModalOptionsActive ? 'show' : 'hidden'}`}>
                <div className='header_settings_list'>
                    <IoMdClose className='icon-close' onClick={() => setIsModalOptionsActive(false)} />  {/*CLOSE OPTIONS*/}
                </div>
                <button className='btn_setting_list' onClick={openFormCopyList}>             {/*BTN OPEN FORM COPY LIST*/}
                    Copiar lista
                </button>
                <button className='btn_setting_list' onClick={openFormMoveList}>            {/*BTN OPEN FORM MOVE LIST*/}
                    Mover lista
                </button>

                <ColorsToList idBoard={idBoard} list={list} />                              {/*CHANGE COLOR LIST*/}

                <button className='btn_setting_list' onClick={() => deleteListt({idBoard, idList})}>             {/* REMOVE LIST */}
                    Eliminar lista
                </button>   
            </div>

            {
            showFormCopyList &&            //Form interfaz que devuelve un string para copiar lista con nuevo nombre
                <FormCopyElement
                nameElement='lista' 
                value={list.nameList}
                closeAll={closeAllFormCopy}
                closeForm={closeFormCopyList} 
                callbackName={(inputText) => callbackHandleCopyList({idBoard, list, inputText})}
                />
            }

            {
                showFormMoveList && (
                    <FormMoveList 
                     idBoard={idBoard} 
                     list={list} 
                     closeAll={closeAllMoveList}
                     closeForm={closeFormMoveList} 
                     callback={(position) => callbackHandleMoveList({idBoard, list, position})} />
                )
            }
        </div>
    )
}