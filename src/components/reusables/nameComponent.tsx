import { useEffect, useRef, useState } from "react";
import '../../styles/components/reusables/nameComponent.scss';
import { CardProps, ListProps } from "../../types/boardProps";
import { useListsServices } from "../../services/listsServices";
import { useCardsServices } from "../../services/cardsServices";
import { updateNameListFirebase } from "../../services/firebase/updateData/updateLists";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { updateNameCardFirebase } from "../../services/firebase/updateData/updateCards";

interface NameListPropsComponent {
  idBoard: string
  list: ListProps
  card?: CardProps
  componentType: 'list' | 'card'
  className?: string
}

export const NameComponent: React.FC<NameListPropsComponent> = ({idBoard, list, card, componentType, className}) => {
  const { listsService } = useListsServices();
  const { cardsServices } = useCardsServices();
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [nameComponent, setNameComponent] = useState('');
  const { userAuth } = useAuthContext();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
 
  useEffect(() => {
    if (componentType === 'list') {
      setNameComponent(list.nameList);
    } else if (componentType === 'card') {
      if (!card) return
      setNameComponent(card.nameCard);
    }
  }, []);

  useEffect(() => {
    if (isOpenInput && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpenInput]);


  const handleChangeList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const idList = list.idList;
    setNameComponent(e.target.value);
    
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
  }

  const handleChangeCard = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const idCard = card?.idCard;
    if (!idCard) return;
    setNameComponent(e.target.value);
    
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
    })
  }

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    target.style.height = "auto"; 
    target.style.height = `${target.scrollHeight}px`;
  }

  const actions = {
    list: handleChangeList,
    card: handleChangeCard
  }

  return (
    <div className={`title_component ${className}`}>
      <h3 
        className='name_component inter'                                         //abrir input
        style={{display: isOpenInput ? 'none' : 'block'}}
        onClick={() => setIsOpenInput(true)}
      >        
        {nameComponent}
      </h3>

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