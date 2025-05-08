import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { BoardProps } from "../../../types/boardProps"
import { auth, db } from "../firebaseConfig"

export const addBoardFirebase = async (board: BoardProps) => {
  const userId = auth.currentUser?.uid;
  const boardRef = doc(collection(db, `users/${userId}/boards`), board.idBoard);
  await setDoc(boardRef, board);
}

export const getBoardFirebase = async (idBoard: string) => {
  try {
    const userId = auth.currentUser?.uid;
    const boardRef = doc(db, `users/${userId}/boards/${idBoard}`);
    const board = await getDoc(boardRef);
    if (!board.exists()) {
      throw new Error
    }
    return board.data() as BoardProps;
    } catch(err) {
      throw new Error('NO SE HALLÓ TABLERO')
  }
}

export const updatedBoardName = async ({idBoard, name}:{idBoard: string, name: string}) => {
  const userId = auth.currentUser?.uid;
  const boardRef = doc(db, `users/${userId}/boards/${idBoard}`);

  await updateDoc(boardRef, { nameBoard: name });
}