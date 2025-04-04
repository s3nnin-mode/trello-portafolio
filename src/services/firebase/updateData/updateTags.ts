import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"
import { CardRef, TagsProps } from "../../../types/boardProps";

//esta funcion recuerda renombrar variables de parametros para ser mas explicito

export const updateStateTag = async ({idTag, idBoard, idList, idCard}:{idTag: string, idBoard: string, idList: string, idCard: string}) => {
  const userId = auth.currentUser?.uid;
  const tagRef = doc(db, `users/${userId}/tags/${idTag}`);
  const tag = await getDoc(tagRef);
  if (!tag.exists()) return

  const isActive = tag.data().cardsThatUseIt.some((card: CardRef) => card.idCard === idCard);
  
  await updateDoc(tagRef, {
    cardsThatUseIt: isActive ? 
      tag.data().cardsThatUseIt.filter((card: CardRef) => 
        card.idCard !== idCard) :
      [...tag.data().cardsThatUseIt, {idBoard: idBoard, idList: idList, idCard}]
  });
} //ESTA FUNCIÓN ESTA LISTA PARA USARSE CON FIREBASE

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
}