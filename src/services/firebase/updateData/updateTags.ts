import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"
import { CardProps, CardRef, TagsProps } from "../../../types/boardProps";

export const updateStateTag = async ({idTag, idBoard, idList, idCard}:{idTag: string, idBoard: string, idList: string, idCard: string}) => {
    const userId = auth.currentUser?.uid;
    const tagRef = doc(db, `users/${userId}/tags/${idTag}`);
    const tag = await getDoc(tagRef);
    if (!tag.exists()) return

    const isActive = tag.data().cardsThatUseIt.some((card: CardRef) => 
        card.idBoard === idBoard && card.idList === idList && card.idCard === idCard);
    
    await updateDoc(tagRef, {
        cardsThatUseIt: isActive ? 
            tag.data().cardsThatUseIt.filter((card: CardRef) => 
                card.idBoard !== idBoard && card.idList !== idList && card.idCard !== idCard) :
            [...tag.data().cardsThatUseIt, {idBoard: idBoard, idList: idList, idCard}]
    });
    console.log('se actualizo el estado de la tag en la card')
}

export const createTagFirebase = async ({tag}:{tag: TagsProps}) => {
    const userId = auth.currentUser?.uid;
    const collectionRef = doc(collection(db, `users/${userId}/tags`), tag.idTag);
    await setDoc(collectionRef, tag);
}

export const updateTag = async ({idTag, name, color}:{idTag: string, name?: string, color?: string}) => {
    const userId = auth.currentUser?.uid;
    const tagRef = doc(db, `users/${userId}/tags/${idTag}`);
    if (name) {
        await updateDoc(tagRef, { nameTag: name });
    }

    if (color) {
        await updateDoc(tagRef, { color });
    }
}

export const deleteTagFirebase = async (idTag: string) => {
    const userId = auth.currentUser?.uid;
    const tagRef = doc(db, `users/${userId}/tags/${idTag}`);
    await deleteDoc(tagRef);
    console.log('se eliminó la tag')
}