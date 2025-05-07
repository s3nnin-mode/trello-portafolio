import { useEffect, useState } from 'react';
import '../../styles/components/reusables/archivedElements.scss';
import { CardProps, ListProps } from '../../types/boardProps';
import { useCardsStore } from '../../store/cardsStore';
import { useListsStore } from '../../store/listsStore';
import { MdChevronLeft } from 'react-icons/md';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { archivedCard } from '../../services/firebase/updateData/updateCards';
import { useCardsServices } from '../../services/cardsServices';
import { archivedList } from '../../services/firebase/updateData/updateLists';
import { useListsServices } from '../../services/listsServices';
import { ModalToRemoveItem } from './modalToRemoveItem';

export const useArchivedElements = () => {
  const { userAuth } = useAuthContext();
  const { cardsServices } = useCardsServices();
  const { listsService } = useListsServices();

  const handleArchivedCard = ({idBoard, idList, idCard, card}: {idBoard: string, idList: string, idCard: string, card: CardProps}) => {

    if (userAuth) {
      console.log('se archivará la card', card);
      archivedCard({idBoard, idList, idCard, archived: !card.archived});
    }

    cardsServices({
      updateFn: (cardsGroup) => cardsGroup.map(cardGroup => 
        cardGroup.idBoard === idBoard && cardGroup.idList === idList
        ? {...cardGroup, cards: cardGroup.cards.map(c => c.idCard === idCard
          ? {...c, archived: !c.archived}
          : c
        )}
        :
        cardGroup
      )
    });

  }

  const handleArchivedList = ({idBoard, idList, archived}:{idBoard: string, idList: string, archived: boolean}) => {
    
    if (userAuth) {
      archivedList({idBoard, idList, archived})
    }

    listsService({
      updateFn: (listsGroup) => listsGroup.map(listGroup =>
        listGroup.idBoard === idBoard
        ? 
        {...listGroup, lists: listGroup.lists.map(l => 
          l.idList === idList
          ?
          {...l, archived}
          : l
        )}
        :
        listGroup
      )
    });

  }

  return { handleArchivedCard, handleArchivedList };
}

interface StateRemoveList {
  show: boolean
  list: ListProps | null
}

interface StateToRemoveCard {
  show: boolean
  list: ListProps | null
  card: CardProps | null
}

export const ArchivedElements = ({idBoard, close}: {idBoard: string, close: () => void}) => {
  const { handleArchivedCard, handleArchivedList } = useArchivedElements();

  const { cardsGroup } = useCardsStore();
  const { listsGroup } = useListsStore();

  const [cards, setCards] = useState<CardProps[]>([]);
  const [lists, setLists] = useState<ListProps[]>([]);

  const [showArchivedCards, setShowArchivedCards] = useState(true);

  const [showModalToRemoveList, setShowModalToRemoveList] = useState<StateRemoveList>();
  const [showModalToRemoveCard, setShowModalToRemoveCard] = useState<StateToRemoveCard>();

  useEffect(() => {
    const archivedCards: CardProps[] = [];
    cardsGroup.forEach(cardGroup => {
      if (cardGroup.idBoard === idBoard) {
        const newArchiveCards = cardGroup.cards.filter(card => card.archived === true);
        archivedCards.push(...newArchiveCards);
      }
    });
    setCards(archivedCards)
  }, [cardsGroup]);

  useEffect(() => {
    const archivedLists: ListProps[] = [];
    listsGroup.forEach(listGroup => {
      if (listGroup.idBoard === idBoard) {
        archivedLists.push(...listGroup.lists.filter(list => list.archived === true));
      }
    });
    setLists(archivedLists);
  }, [listsGroup]);

  const findIdList = (card: CardProps) => {
    return cardsGroup.find(cardGroup => cardGroup.cards.some(c => c.idCard === card.idCard))?.idList;
  }

  const findList = (idList: string) => {
    return listsGroup.find(listGroup => listGroup.lists.some(list => list.idList === idList))?.lists.find(list => list.idList === idList);
  }

  const handleShowModalToRemoveCard = (card: CardProps) => {
    const idList = findIdList(card);
    if (!idList) return;

    const list = findList(idList);
    if (!list) return;
    setShowModalToRemoveCard({show: true, list, card});
  }

  return (
    <>
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
            className='inter'
              onClick={() => setShowArchivedCards(true)}
              style={{
                background: showArchivedCards ? '#fff' : 'transparent',
                color: showArchivedCards ? '#2E2E2E' : '#ccc'
              }}
            >
              Tarjetas
            </button>
            <button 
              className='inter'
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
            ? cards.length > 0
              ? cards.map(card => {
                const idList = findIdList(card);
                if (!idList) {
                  return <li>No se pudo generar la tarjeta archivada {card.nameCard}</li>
                }
                return (
                  <li key={card.idCard}>
                    <article>
                      <div className='visualizador_container'>
                        <span style={{background: card.coverColorCard || 'grey'}} className='circle' />
                        <span style={{background: card.coverColorCard || 'grey'}} className='circle' />
                      </div>
                      <h1 className='inter'>{card.nameCard}</h1>
                      <div>
                        <button onClick={() => handleArchivedCard({idBoard, idList, idCard: card.idCard, card})}>
                          Desarchivar
                        </button>
                        <button onClick={() => handleShowModalToRemoveCard(card) }>
                          Eliminar
                        </button>
                      </div>
                    </article>
                  </li>
                )
            }) : <li className='text_no_archived_cards roboto_light'>No hay tarjetas archivadas.</li>
            : lists.length > 0 
            ? lists.map(list => (
              <li key={list.idList}>
                <article style={{background: list.colorList}}>
                  <h1>{list.nameList}</h1>
                  <div>
                    <button onClick={() => handleArchivedList({idBoard, idList: list.idList, archived: !list.archived})}>
                      Desarchivar
                    </button>
                    <button onClick={() => setShowModalToRemoveList({show: true, list})}>
                      Eliminar
                    </button>
                  </div>
                </article>
              </li>
            ))
            : <li className='text_no_archived_lists roboto_light'>No hay listas archivadas.</li>
        }
        </ul>
      </article>

      {
        showModalToRemoveList?.show && showModalToRemoveList.list && (
          <ModalToRemoveItem 
            idBoard={idBoard} 
            list={showModalToRemoveList.list}
            show={showModalToRemoveList.show}
            onHide={() => setShowModalToRemoveList({show: false, list: null})}
            itemToRemove='list'
          />
        )
      }

      {
        showModalToRemoveCard?.show && showModalToRemoveCard?.card && showModalToRemoveCard.list && (
          <ModalToRemoveItem 
            idBoard={idBoard} 
            list={showModalToRemoveCard.list}
            card={showModalToRemoveCard?.card}
            show={showModalToRemoveCard.show}
            onHide={() => setShowModalToRemoveCard({show: false, card: null, list: null})}
            itemToRemove='card'
          />
        )
      }

    </>
  )
} 