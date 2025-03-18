import '../../../../styles/components/card/modalCard/modalComponents/titleModalCard.scss';
import { BoardProps, CardProps, ListProps } from "../../../../types/boardProps";
import { NameComponent } from "../../../reusables/nameComponent";

interface TitleModalCardProps {
  board: BoardProps
  list: ListProps
  card: CardProps
}

export const TitleModalCard: React.FC<TitleModalCardProps> = ({card, list, board}) => {

  return (
    <article className='name_card_container'>
      <span className='label_card_title inter_title'>Tarjeta:</span>
      <NameComponent idBoard={board.idBoard} list={list} card={card} componentType='card' className='name_card_container' />
      {/* <p className='nameList_modal_card'>
        En la lista <span>{list.nameList}</span>
      </p> */}
    </article>
  )
}