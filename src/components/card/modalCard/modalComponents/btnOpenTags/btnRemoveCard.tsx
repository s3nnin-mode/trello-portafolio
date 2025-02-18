import { useState } from "react"
import { CardProps, ListProps } from "../../../../../types/boardProps"
import { ModalToRemoveItem } from "../../../../reusables/modalToRemoveItem"

interface BtnRemoveCardProps {
    idBoard: string
    list: ListProps
    card: CardProps
}

export const BtnRemoveCard: React.FC<BtnRemoveCardProps> = ({idBoard, list, card}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
        <button className='btn_modal_sidebar remove_card' onClick={() => setShowModal(true)}>
            Eliminar tarjeta
        </button>
        {
            showModal && (
                <ModalToRemoveItem
                show={showModal}
                onHide={() => setShowModal(false)}
                idBoard={idBoard} 
                list={list} 
                card={card} 
                itemToRemove='card' />
            )
        }
        </>
    )
}