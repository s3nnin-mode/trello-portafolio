import { useEffect, useState } from 'react';
import '../../styles/components/reusables/archivedElements.scss';
import { CardProps, ListProps } from '../../types/boardProps';
import { useCardsStore } from '../../store/cardsStore';
import { useListsStore } from '../../store/listsStore';
import { MdChevronLeft } from 'react-icons/md';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { archivedCard, deleteCard } from '../../services/firebase/updateData/updateCards';
import { useCardsServices } from '../../services/cardsServices';
import { archivedList, deleteListFirebase } from '../../services/firebase/updateData/updateLists';
import { useListsServices } from '../../services/listsServices';

export const ArchivedElements = ({idBoard, close}: {idBoard: string, close: () => void}) => {
  const { cardsGroup } = useCardsStore();
  const { listsGroup } = useListsStore();

  const { cardsServices } = useCardsServices();
  const { listsService } = useListsServices();

  const { userAuth } = useAuthContext();

  const [cards, setCards] = useState<CardProps[]>();
  const [lists, setLists] = useState<ListProps[]>();

  const [showArchivedCards, setShowArchivedCards] = useState(true);

  useEffect(() => {
    cardsGroup.forEach(cardGroup => {
      if (cardGroup.idBoard === idBoard) {
        setCards(cardGroup.cards.filter(card => card.archived === true));
      }
    });

    listsGroup.forEach(listGroup => {
      if (listGroup.idBoard === idBoard) {
        setLists(listGroup.lists.filter(list => list.archived === true));
      }
    });
    
  }, [cardsGroup, listsGroup]);

  const handleArchivedCard = (card: CardProps) => {
    const idList = cardsGroup.find(cardGroup => cardGroup.cards.some(c => c.idCard === card.idCard))?.idList;
    if (!idList) return;

    if (userAuth) {
      archivedCard({idBoard, idList, idCard: card.idCard, archived: !card.idCard});
    }

    cardsServices({
      updateFn: (cardsGroup) => cardsGroup.map(cardGroup => 
        cardGroup.idBoard === idBoard && cardGroup.idList == idList
        ? 
        {...cardGroup, cards: cardGroup.cards.map(c => c.idCard === card.idCard
          ?
          {...c, archived: !c.archived}
          :
          c
        )}
        :
        cardGroup
      )
    });
  }

  const handleRemoveCard = (card: CardProps) => {
    const idList = cardsGroup.find(cardGroup => cardGroup.cards.some(c => c.idCard === card.idCard))?.idList;
    if (!idList) return;

    if (userAuth) {
      deleteCard({idBoard, idList, idCard: card.idCard});
    }

    cardsServices({
      updateFn: (cardsGroup) => cardsGroup.map(cardGroup => 
        cardGroup.idBoard === idBoard && cardGroup.idList == idList
        ? 
        {...cardGroup, cards: cardGroup.cards.filter(c => c.idCard !== card.idCard)}
        :
        cardGroup
      )
    });
  }

  const handleArchivedList = (list: ListProps) => {
    if (userAuth) {
      archivedList({idBoard, idList: list.idList, archived: !list.archived})
    }

    listsService({
      updateFn: (listsGroup) => listsGroup.map(listGroup =>
        listGroup.idBoard === idBoard
        ? 
        {...listGroup, lists: listGroup.lists.map(l => 
          l.idList === list.idList
          ?
          {...l, archived: !list.archived}
          : l
        )}
        :
        listGroup
      )
    });

  }

  const handleRemoveList = (list: ListProps) => {
    const idList = list.idList;
    if (userAuth) {
      deleteListFirebase({idBoard, idList});
    }
    listsService({
      updateFn: (state) => state.map((listGroup) => 
      listGroup.idBoard === idBoard ?
      {...listGroup, lists: listGroup.lists.filter(list => list.idList !== idList)} :
      listGroup
      )
    });
  }

  return (
    <article className='archived_elements'>
      <header>
        <div className='title_and_btn_close'>
          <h1 className='inter_title'>Elementos archivados</h1>
          <button className='btn_close_archived_elements' onClick={close}>
            <MdChevronLeft className='icon' style={{color: 'white'}}/>
          </button>
        </div>
        {/* <input></input> */}
        <div className='inter'>
          <button 
            onClick={() => setShowArchivedCards(true)}
            style={{
              background: showArchivedCards ? '#fff' : 'transparent',
              color: showArchivedCards ? '#2E2E2E' : '#ccc'
            }}
          >
            Tarjetas
          </button>
          <button 
            onClick={() => setShowArchivedCards(false)}
            style={{
              background: !showArchivedCards ? '#fff' : 'transparent',
              color: !showArchivedCards ? '#2E2E2E' : '#ccc'
            }}
          >
            Listas
          </button>
        </div>
      </header>
      <ul>
        {showArchivedCards
        ? cards?.map(card => (
          <li key={card.idCard}>
            <article>
              <div className='visualizador_container'>
                {/* <input type='checkbox' /> */}
                <span style={{background: card.coverColorCard || 'grey'}} className='circle' />
                <span style={{background: card.coverColorCard || 'grey'}} className='circle' />
              </div>
              <h1 className='inter'>{card.nameCard}</h1>
              <div>
                <button onClick={() => handleArchivedCard(card)}>
                  Desarchivar
                </button>
                <button onClick={() => handleRemoveCard(card)}>
                  Eliminar
                </button>
              </div>
            </article>
          </li>
        ))
        : lists?.map(list => (
          <li key={list.idList}>
            <article style={{background: list.colorList}}>
              <h1>{list.nameList}</h1>
              <div>
                <button onClick={() => handleArchivedList(list)}>
                  Desarchivar
                </button>
                <button onClick={() => handleRemoveList(list)}>
                  Eliminar
                </button>
              </div>
            </article>
          </li>
        ))
      }
      </ul>
    </article>
  )
} 