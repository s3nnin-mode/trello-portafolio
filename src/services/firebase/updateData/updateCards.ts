import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { auth, db, storage } from "../firebaseConfig"
import { CardProps } from "../../../types/boardProps";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const addCardFirebase = async ({idBoard, idList, card}: {idBoard: string, idList: string, card: CardProps}) => {
  const userId = auth.currentUser?.uid;
  const cardsRef = doc(collection(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards`), card.idCard);
  await setDoc(cardsRef, card);
  console.log('se agregó la card en firebase');
}

export const addCardAtTopFirebase = async (
  {idBoard, idList, card, cardsUpdate}: 
  {idBoard: string, idList: string, card: CardProps, cardsUpdate: CardProps[]}
  ) => {

  const userId = auth.currentUser?.uid;
  const batch = writeBatch(db);

  const cardsRef = doc(collection(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards`), card.idCard);
  batch.set(cardsRef, card);

  cardsUpdate.forEach((card, index) => {
    const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${card.idCard}`);
    batch.update(cardRef, { order:  10 * index});
  });
  await batch.commit();
}

export const updateOrderCard = async ({idBoard, idList, card}: {idBoard: string, idList: string, card: CardProps}) => {
  const userId = auth.currentUser?.uid;
  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${card.idCard}`);
  await updateDoc(cardRef, { order: card.order });
}

export const updateOrderCards = async ({idBoard, idList, updatedCards}: {idBoard: string, idList: string, updatedCards: CardProps[]}) => {
  const userId = auth.currentUser?.uid;

  const updates = updatedCards.map(async (card, index) => {
    const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${card.idCard}`);
    const order = index === 0 ? 0 : index * 10;
    await updateDoc(cardRef, { order });
  });

  await Promise.all(updates);
}

// export const updateOrdersCard = async ({idBoard, idList, cards}: {idBoard: string, idList: string, cards: CardProps[]}) => {
//     const userId = auth.currentUser?.uid;
//     const batch = writeBatch(db);

//     cards.forEach((card, index) => {
//         const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${card.idCard}`);
//         batch.update(cardRef, { order: index * 10});
//     });
//     await batch.commit();
//     console.log('se reordenaron cards al agregar una card al principio');
// }

export const moveCardThoAnotherList = async (
  {idBoard, idListOrigen, idListDestiny, card, updateCards}: 
  {idBoard: string, idListOrigen: string, idListDestiny: string, card: CardProps, updateCards?: CardProps[]}
  ) => {

  const userId = auth.currentUser?.uid;

  const batch = writeBatch(db);
  const origenCardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idListOrigen}/cards/${card.idCard}`);
  batch.delete(origenCardRef);

  console.log('idList Origen: ', idListOrigen);
  console.log('idListDestiny', idListDestiny);
  console.log('card a eliminar en firebase: cardName:', card.nameCard);

  const destinyCardRef = doc(collection(db, `users/${userId}/boards/${idBoard}/lists/${idListDestiny}/cards`), card.idCard);
  batch.set(destinyCardRef, card);
  console.log('se movio una card a otra lista exitosamente');

  if (updateCards) {
    updateCards.forEach((card, index) => {
      const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idListDestiny}/cards/${card.idCard}`);
      batch.update(cardRef, { order:  10 * index});
    });
    console.log('se reordeno cards al mover card a otra lista en firebase');
  }

  await batch.commit();
}

export const updateNameCardFirebase = async ({idBoard, idList, idCard, name}:{idBoard: string, idList: string, idCard: string, name: string}) => {
  const userId = auth.currentUser?.uid;

  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
  await updateDoc(cardRef, { nameCard: name })
}

export const updateDescriptionCard = async ({idBoard, idList, idCard, description}:{idBoard: string, idList: string, idCard: string, description: string | null}) => {
  const userId = auth.currentUser?.uid;

  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
  await updateDoc(cardRef, { description });
}

export const updateCoverCard = async (
    {idBoard, idList, idCard, type, cover}:{idBoard: string, idList: string, idCard: string, type: string, cover: string | File}
) => {
  const userId = auth.currentUser?.uid;
  const storageRef = ref(storage, `users/${userId}/cards/${idCard}`);
  if (type === 'img' && cover instanceof File) {
    await uploadBytes(storageRef, cover);
    const downloadUrl = await getDownloadURL(storageRef);
    const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);

    const cardSnap = await getDoc(cardRef);
    if (!cardSnap.exists()) return;
    const historyImgs = cardSnap.data().coverCardImgs || [];

    await updateDoc(cardRef, { 
      currentCoverType: type, 
      coverCard: downloadUrl, 
      coverCardImgs: [...historyImgs, downloadUrl] 
    });
  } else if (type === 'color') {
    const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
    await updateDoc(cardRef, { currentCoverType: type, coverCard: cover });
  }
}

export const updateColorCoverCard = async ({idBoard, idList, idCard, color}:{idBoard: string, idList: string, idCard: string, color: string | null}) => {
  const userId = auth.currentUser?.uid;
  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`)
  await updateDoc(cardRef, { coverColorCard: color });
}

export const updateImgCoverCard = async ({idBoard, idList, idCard, img}:{idBoard: string, idList: string, idCard: string, img: File | null}) => {
  const userId = auth.currentUser?.uid;
  let downloadUrl = null;
  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
  const cardSnap = await getDoc(cardRef);
  if (!cardSnap.exists()) return;
  const coverCardImgs = cardSnap.data().coverCardImgs;

  if (img instanceof File) {
    const uniqueId = `${idCard}-img-${Date.now()}`;
    const storageRef = ref(storage, `users/${userId}/cards/${uniqueId}`);
    await uploadBytes(storageRef, img);
    downloadUrl = await getDownloadURL(storageRef);

    await updateDoc(cardRef, {
      coverImgCard: downloadUrl,
      coverCardImgs: [...coverCardImgs, downloadUrl]
    });

    return {
      coverImgCard: downloadUrl,
      coverCardImgs: [...coverCardImgs, downloadUrl]
    };
  } else {
    await updateDoc(cardRef, { coverImgCard: null });
    return {
      coverImgCard: null,
      coverCardImgs
    }
  }
}

export const updatedCoverImg = async ({idBoard, idList, idCard, img}:{idBoard: string, idList: string, idCard: string, img: string | null}) => {
  const userId = auth.currentUser?.uid;
  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
  await updateDoc(cardRef, { coverImgCard: img })
}

export const updateCompleteCard = async ({idBoard, idList, idCard, complete}:{idBoard: string, idList: string, idCard: string, complete: boolean}) => {
  const userId = auth.currentUser?.uid;
  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
  await updateDoc(cardRef, { complete });
}

export const deleteCard = async ({idBoard, idList, idCard}:{idBoard: string, idList: string, idCard: string}) => {
  const userId = auth.currentUser?.uid;
  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
  await deleteDoc(cardRef);
}

export const getCardFirebase = async ({ idBoard, idList, idCard }: { idBoard: string, idList: string, idCard: string }) => {
  const userId = auth.currentUser?.uid;
  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
  const card = await getDoc(cardRef);

  return card.data() as CardProps;
};

//ARCHIVED CARDS FUNCTIONS

export const archivedCard = async ({idBoard, idList, idCard, archived}: {idBoard: string, idList: string, idCard: string, archived: boolean}) => {
  const userId = auth.currentUser?.uid;
  const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);

  await updateDoc(cardRef, { archived });
  console.log('se archivó correctamente la card: ', idCard);
}

export const getArchivedCards = async ({idBoard}:{idBoard: string}) => {
  const userId = auth.currentUser?.uid;

  const archivedCardsCollection = collection(db, `users/${userId}/boards/${idBoard}/archivedCards`);
  const archivedCardsSnapshot = await getDocs(archivedCardsCollection);

  const archivedCards = archivedCardsSnapshot.docs.map(doc => doc.data() as CardProps);
  console.log('cards archivadas obtenidas: ', archivedCards);
  return archivedCards;
}