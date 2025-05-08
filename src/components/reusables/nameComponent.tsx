import { useEffect, useRef, useState } from "react";
import '../../styles/components/reusables/nameComponent.scss';
import { BoardProps, CardProps, ListProps } from "../../types/boardProps";
import { useListsServices } from "../../services/listsServices";
import { useCardsServices } from "../../services/cardsServices";
import { updateNameListFirebase } from "../../services/firebase/updateData/updateLists";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { updateNameCardFirebase } from "../../services/firebase/updateData/updateCards";
// import { CiEdit } from "react-icons/ci";
import { FiEdit3 } from "react-icons/fi";
import { updatedBoardName } from "../../services/firebase/updateData/updateBoards";
import { useBoardsServices } from "../../services/boardsServices";

interface NameListPropsComponent {
  idBoard: string
  board?: BoardProps
  list?: ListProps
  card?: CardProps
  componentType: 'list' | 'card' | 'board'
  className?: string
}

export const NameComponent: React.FC<NameListPropsComponent> = ({idBoard, list, card, componentType, className, board}) => {
  const { listsService } = useListsServices();
  const { cardsServices } = useCardsServices();
  const { boardsService } = useBoardsServices();

  const [isOpenInput, setIsOpenInput] = useState(false);
  const [nameComponent, setNameComponent] = useState('');
  const { userAuth } = useAuthContext();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    if (componentType === 'list' && list) { //!!se agrego list
      setNameComponent(list.nameList);
    } else if (componentType === 'card') {
      if (!card) return
      setNameComponent(card.nameCard);
    } else if (componentType === 'board') {
      if (!board) {
        console.log('NO SE HALLO NINGUN BOARD PARA EL NAME')
        return
      }
      console.log('SE DIO EL NOMBRE', board.nameBoard)
      setNameComponent(board.nameBoard)
    }

  }, []);

  useEffect(() => {
    if (isOpenInput && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpenInput]);


  const handleChangeList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!list) return;
    const idList = list.idList;
    setNameComponent(e.target.value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {

      if (userAuth) {
        updateNameListFirebase({idBoard, idList, nameList: e.target.value});
      }
  
      listsService({
        updateFn: (listsGroup) => listsGroup.map((listGroup) => 
          listGroup.idBoard === idBoard
          ?
          { ...listGroup,
            lists: listGroup.lists.map((list) => 
              list.idList === idList ? 
              { ...list, nameList: e.target.value } 
              : 
              list
            )
          }
          :
          listGroup
        )
      });

    }, 500); // Esperar 500ms antes de ejecutar la función

  }

  const handleChangeCard = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const idCard = card?.idCard;
    if (!idCard || !list) return;
    setNameComponent(e.target.value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (userAuth) {
        updateNameCardFirebase({
          idBoard, 
          idList: list.idList, 
          idCard, 
          name: e.target.value
        });
      }

      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) =>
        cardGroup.idBoard === idBoard && cardGroup.idList === list.idList ?
        { ...cardGroup, cards: cardGroup.cards.map((card) => 
          card.idCard === idCard ? 
          {...card, nameCard: e.target.value}
          :
          card
          )
        }
        :
          cardGroup
        )
      });
    }, 500); // Esperar 500ms antes de ejecutar la función
  }

  const handleChangeBoard = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNameComponent(e.target.value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {

      if (userAuth) {
        updatedBoardName({idBoard, name: e.target.value});
      }
      
      boardsService({
        updateFn: (boardsGroup) => boardsGroup.map(board => board.idBoard === idBoard
          ? {...board, nameBoard: e.target.value}
          : board
        )
      })

    }, 500); // Esperar 500ms antes de ejecutar la función
  }

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    target.style.height = "auto"; 
    target.style.height = `${target.scrollHeight}px`;
  }

  const actions = {
    list: handleChangeList,
    card: handleChangeCard,
    board: handleChangeBoard
  }

  return (
    <div className={`title_component ${className}`}>
      <button 
        className='name_component inter_subtitle'                                         //abrir input
        style={{
          display: isOpenInput ? 'none' : 'block',
          color: card?.coverColorCard || '#ccc'
        }}
        onClick={() => setIsOpenInput(true)}
      >        
        {nameComponent}
        <FiEdit3 style={{color: card?.coverColorCard || 'white'}} className='icon_open_textarea' />
      </button>
      {/* <FiEdit3 className='icon_open_textarea' /> */}

      {isOpenInput && (
        <textarea
          ref={textareaRef}
          onPointerDown={(e) => e.stopPropagation()} //Para poder seleccionar un trozo de texto sin que se active el drag
          onKeyDown={(e) => e.stopPropagation()}
          style={{overflow: "hidden", resize: "none"}}
          onInput={onInput}
          value={nameComponent}
          onChange={actions[componentType]} 
          onBlur={() => setIsOpenInput(false)} // Ocultar textarea al perder el foco 
        />
      )}
    </div> 
  )
}