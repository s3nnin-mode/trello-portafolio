import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { BoardProps } from '../../types/boardProps';

const initialData = async (userId: string) => {
  try {
    
    const boardRef = doc(db, `users/${userId}/boards`, 'primerboardid');
    const initialBoard = {
      idBoard: 'primerboardid',  
      nameBoard: 'Tablero de ejemplo',
    }

    await setDoc(boardRef, initialBoard);

    const specificBoardRef = doc(db, `users/${userId}/boards/primerboardid`);
    const listsRef = doc(collection(specificBoardRef, 'lists'), 'primerlistid');
    const initialList = {
      idList: 'primerlistid',
      nameList: 'lista de ejemplo',
      colorList: 'white',
    };

    await setDoc(listsRef, initialList);

    const cardsRef = doc(collection(listsRef, 'cards'), 'primercardid');

    const initialCards = {
      idCard: 'primercardid',
      nameCard: 'card de ejemplo',
      coverCard: '',
      coverCardImgs: [],
      currentCoverType: '',
      complete: false,
      description: ''
    }

    await setDoc(cardsRef, initialCards);
    console.log("Tablero, lista y tarjeta creados exitosamente.");

  } catch {
    //pendiente
  }
}

export const userRegister = async ({email, password}: {email: string, password: string}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    console.log('Usurio registrado correctamente', userCredential.user);

    await setDoc(doc(db, 'users', userId), {
      userName: '',
      email,
      photo: ''
    });

    ////////////////////////

    await initialData(userId);

    // await signOut(auth);
    
    return 'Registro exitoso';
  } catch(error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.error('The email is already registered.');
      return 'The email is already registered.'
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email format.');
      return 'Invalid email format.';
    } else if (error.code === 'auth/weak-password') {
      console.error('Password is too weak.');
      return 'Password is too weak.';  //esta validacion sirve
    } else {
      console.error('Error during registration:', error.message);
      return 'Error during registration';
    }
  }
}

export const userLogin = ({email, password}: {email: string, password: string}) => {
  return signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log('usuario logeado correctamente: ', user)
    return 'Login exitoso';
  })
  .catch((error) => {
    const errorCode = error.code.trim();
    const errorMessage = error.message;
    console.log('error login errorCode: ', errorCode);
    console.log('error login message: ', errorMessage)
    switch (error.code) {
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde.';
      case 'auth/invalid-credential':
        return 'Credenciales invalidas, porfavor verifica tu correo y contraseña.'
      default:
        return 'Ocurrió un error inesperado. Inténtalo más tarde.';
    } 
  });
}

export const updateNombreUser = async(newName: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const docRef = doc(db, 'users', user.uid);
  try {
    await updateDoc(docRef, { name: newName });
    return true;
  } catch(error) {
    return false
  }
}

export const getDataFirebase = async () => {
  const userId = auth.currentUser?.uid;
  const boardsCollection = collection(db, `users/${userId}/boards`);
  const boardsSnapshot = await getDocs(boardsCollection);
  const boards = boardsSnapshot.docs.map((doc) => doc.data() as BoardProps);
  console.log('data boards', boards);
  return boards;
}