import { useState } from "react";
import '../../../styles/components/list/optionsList/optionsList.scss';

//REACT-ICONS
import { IoMdClose } from "react-icons/io";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
//COMPONENTS
import { FormCopyElement } from "./formsOptions/copiarElemento";
import { FormMoveList } from "./formsOptions/formMoverLista";
import { ColorsToList } from "./formsOptions/colorsList";
import { ModalToRemoveItem } from "../../reusables/modalToRemoveItem";
//STORES
// import { useListsStore } from "../../store/listsStore";
// import { useBoardsStoree } from "../../store/boardsStore";
//TYPES
import { ListProps } from "../../../types/boardProps";
//HOOKS
import { useFormCopyList } from "../../../customHooks/list/formCopyList";
import { useFormMoveList } from "../../../customHooks/list/formMoveList";
import { BtnAdd } from "../../reusables/btnAgregar";
// import { useList } from "./lista";
// import { useAccesDirectToAddTarget } from "../../customHooks/list/accesDirectAddTarget";
import { CardProps } from "../../../types/boardProps";
import { useCardsServices } from "../../../services/cardsServices";

interface SettingsListProps {
    idBoard: string
    list: ListProps
}

export const useSettingsModalList = () => {
    const [isModalOptionsActive, setIsModalOptionsActive] = useState(false);          //El estado de las opciones esta en un customHook para poder acceder a esta instancia y manipular el estado
    return { isModalOptionsActive, setIsModalOptionsActive }                           //desde otros customsHooks(pasandoles este 'set' como parametro)
}

export const SettingsList: React.FC<SettingsListProps> = ({ idBoard, list }) => {
    const { isModalOptionsActive, setIsModalOptionsActive} = useSettingsModalList();
    const { showFormCopyList, openFormCopyList, closeFormCopyList, closeAllFormCopy, callbackHandleCopyList } = useFormCopyList({setIsModalOptionsActive});
    const { showFormMoveList, openFormMoveList, closeFormMoveList, closeAllMoveList, callbackHandleMoveList } = useFormMoveList({setIsModalOptionsActive});
    const [ showModalToRemoveList, setShowModalToRemoveList ] = useState(false);
    const { cardsServices } = useCardsServices();

    const addNewCard = (nameCard: string) => {
        const cardToAdd: CardProps = {
            idCard: (nameCard + Date.now()).toString(), 
            nameCard: nameCard,
            coverCard: 'grey',
            coverCardImgs: [],
            currentCoverType: 'color',
            complete: false,
            description: null
        };

        cardsServices({
            updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => 
                cardGroup.idBoard === idBoard && cardGroup.idList === list.idList ?
                    {
                        ...cardGroup,
                        cards: [cardToAdd, ...cardGroup.cards]
                    }
                :
                    cardGroup
            )
        });
    }

    return (
        <div className='options' onPointerDown={(e) => e.stopPropagation()}>       
            <button onClick={() => setIsModalOptionsActive(true)} className='btn_active_options'>
                <PiDotsThreeOutlineFill className='icon_options_list' />
            </button>

            <div className={`settings_list_${isModalOptionsActive ? 'show' : 'hidden'}`}>
                <div className='header_settings_list'>
                    <IoMdClose className='icon-close' onClick={() => setIsModalOptionsActive(false)} />  {/*CLOSE OPTIONS*/}
                </div>

                <BtnAdd 
                className='form_add_target_to_top'
                nameComponentToAdd='target'
                createListOrTargetName={(nameCard: string) => addNewCard(nameCard)} />

                <button className='btn_setting_list' onClick={openFormCopyList}>             {/*BTN OPEN FORM COPY LIST*/}
                    Copiar lista
                </button>
                <button className='btn_setting_list' onClick={openFormMoveList}>            {/*BTN OPEN FORM MOVE LIST*/}
                    Mover lista
                </button>

                <ColorsToList idBoard={idBoard} list={list} />                              {/*CHANGE COLOR LIST*/}

                <button className='btn_setting_list' onClick={() => setShowModalToRemoveList(true)}>             {/* REMOVE LIST */}
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

            <ModalToRemoveItem 
                show={showModalToRemoveList} 
                onHide={() => setShowModalToRemoveList(false)} 
                idBoard={idBoard} 
                list={list} 
                itemToRemove='list'
                />
        </div>
    )
}