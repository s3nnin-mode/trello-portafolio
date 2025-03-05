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

export const addCardToTopFirebase = async (
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
    {idBoard, idListOrigen, idListDestiny, card, cardsUpdate}: 
    {idBoard: string, idListOrigen: string, idListDestiny: string, card: CardProps, cardsUpdate: CardProps[]}
    ) => {

    const userId = auth.currentUser?.uid;

    const batch = writeBatch(db);
    const origenCardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idListOrigen}/cards/${card.idCard}`);
    batch.delete(origenCardRef);

    const destinyCardRef = doc(collection(db, `users/${userId}/boards/${idBoard}/lists/${idListDestiny}/cards`), card.idCard);
    batch.set(destinyCardRef, card);
    console.log('se movio una card a otra lista exitosamente');

    cardsUpdate.forEach((card, index) => {
        const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idListDestiny}/cards/${card.idCard}`);
        batch.update(cardRef, { order:  10 * index});
    });
    await batch.commit();
    console.log("✅ Card movida y órdenes actualizadas en Firestore");
}

export const updateNameCardFirebase = async ({idBoard, idList, idCard, name}:{idBoard: string, idList: string, idCard: string, name: string}) => {
    const userId = auth.currentUser?.uid;

    const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
    await updateDoc(cardRef, { nameCard: name })
}

export const updateDescriptionCard = async ({idBoard, idList, idCard, description}:{idBoard: string, idList: string, idCard: string, description: string}) => {
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

export const updateCompleteCard = async ({idBoard, idList, idCard, complete}:{idBoard: string, idList: string, idCard: string, complete: boolean}) => {
    const userId = auth.currentUser?.uid;

    const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${idCard}`);
    
    await updateDoc(cardRef, { complete });
}