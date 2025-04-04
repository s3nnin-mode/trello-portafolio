import { collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { ListProps } from "../../../types/boardProps";
import { auth, db } from "../firebaseConfig";

// export const addListFirebase = async ({idBoard, list, order}:{idBoard: string, list: ListProps, order: number}) => {
//     const userId = auth.currentUser?.uid;
//     const listsCollection = doc(collection(db, `users/${userId}/boards/${idBoard}/lists`), list.idList);
//     await setDoc(listsCollection, {...list, order: order});
// }

export const addListFirebase = async ({idBoard, list}:{idBoard: string, list: ListProps}) => {
    const userId = auth.currentUser?.uid;
    const listsCollection = doc(collection(db, `users/${userId}/boards/${idBoard}/lists`), list.idList);
    await setDoc(listsCollection, list);
} //ESTA FUNCIÓN ESTA LISTA PARA USARSE CON FIREBASE

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

export const updateOrderListsFirebase = async ({idBoard, updatedLists}: {idBoard: string, updatedLists: ListProps[]}) => {  //esto se usa cuando copias o mueves una lista
    const userId = auth.currentUser?.uid;

    const updates = updatedLists.map(async (list, index) => {
        const listRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${list.idList}`);
        // const lista = getDoc(listRef);
        const order = index === 0 ? 0 : index * 10;
        await updateDoc(listRef, { order });
        console.log('se actualiza cada lista', list, list.order)
    });

    await Promise.all(updates);
    console.log('listas actualizadas', updatedLists);
};

export const updtateOrderList = async ({idBoard, list}: {idBoard: string, list: ListProps}) => {
    const userId = auth.currentUser?.uid;

    const listRef = doc(db, `users/${userId}/boards/${idBoard}/lists/${list.idList}`);

    await updateDoc(listRef, {...list});
};