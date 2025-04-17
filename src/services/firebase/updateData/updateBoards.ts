import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { BoardProps } from "../../../types/boardProps"
import { auth, db } from "../firebaseConfig"

export const addBoardFirebase = async (board: BoardProps) => {
  const userId = auth.currentUser?.uid;
  const boardRef = doc(collection(db, `users/${userId}/boards`), board.idBoard);
  await setDoc(boardRef, board);
}

export const getBoardFirebase = async (idBoard: string) => {
  const userId = auth.currentUser?.uid;
  const boardRef = doc(db, `users/${userId}/boards/${idBoard}`);
  const board = await getDoc(boardRef);
  return board.data() as BoardProps;
}