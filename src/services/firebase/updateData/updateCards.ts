import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"
import { CardProps } from "../../../types/boardProps";

export const addCardFirebase = async ({idBoard, idList, card}: {idBoard: string, idList: string, card: CardProps}) => {
    const userId = auth.currentUser?.uid;
    const cardsRef = doc(collection(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards`), card.idCard);
    await setDoc(cardsRef, card);
    console.log('se agregó la card en firebase');
}

export const updateOrderCard = async ({idBoard, idList, card}: {idBoard: string, idList: string, card: CardProps}) => {
    const userId = auth.currentUser?.uid;
    const cardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards/${card.idCard}`);
    await updateDoc(cardRef, { order: card.order });
}

export const moveCardThoAnotherList = async (
    {idBoard, idListOrigen, idListDestiny, card, cardsUpdate}: 
    {idBoard: string, idListOrigen: string, idListDestiny: string, card: CardProps, cardsUpdate: CardProps[]}
    ) => {
    const userId = auth.currentUser?.uid;
    const origenCardRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idListOrigen}/cards/${card.idCard}`);
    await deleteDoc(origenCardRef);

    const destinyCardRef = doc(collection(db, `users/${userId}/boards/${idBoard}/lists/${idListDestiny}/cards`), card.idCard);
    await setDoc(destinyCardRef, card);
    console.log('se movio una card a otra lista exitosamente');
}