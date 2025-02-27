import { collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { ListProps } from "../../../types/boardProps";
import { auth, db } from "../firebaseConfig";

export const addListFirebase = async ({idBoard, list, order}:{idBoard: string, list: ListProps, order: number}) => {
    const userId = auth.currentUser?.uid;
    const listsCollection = doc(collection(db, `users/${userId}/boards/${idBoard}/lists`), list.idList);
    await setDoc(listsCollection, {...list, order: order});
}

export const updateNameListFirebase = async ({idBoard, idList, nameList}:{idBoard: string, idList: string, nameList: string}) => {
    const userId = auth.currentUser?.uid;
    const docRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}`);
    await updateDoc(docRef, { nameList });
}

export const updateColorListFirebase = async ({idBoard, idList, color}:{idBoard: string, idList: string, color: string}) => {
    const userId = auth.currentUser?.uid;
    const docRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}`);
    await updateDoc(docRef, { colorList: color });
};

export const deleteListFirebase = async ({idBoard, idList}:{idBoard: string, idList: string}) => {
    const userId = auth.currentUser?.uid;
    const listRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${idList}`);
    await deleteDoc(listRef);
}

export const copyListAndUpdateOrderListsFirebase = async ({idBoard, updateLists}: {idBoard: string, updateLists: ListProps[]}) => {  //esto se usa cuando copias o mueves una lista
    const userId = auth.currentUser?.uid;

    await Promise.all(updateLists.map(async (list, index) => {
        const listRef = doc(collection(db, `users/${userId}/boards/${idBoard}/lists`), list.idList);
        await updateDoc(listRef, {...list, order: index});
    }));
    console.log('se copió lista y actulizó el orden')
};

