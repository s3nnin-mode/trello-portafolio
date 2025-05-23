import { doc, setDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { BoardProps, CardProps, TagsProps } from '../../types/boardProps';
import { ListProps } from '../../types/boardProps';
import { initialTags } from '../../utils/tagsColors';

export const logoutFirebase = async () => {
  return await auth.signOut()
  .then(() => {
    console.log('sesion cerrada correctamente')
    return true
  }).catch((error) => {
    console.log('error al cerrar sesion: ', error)
    return false
  }
  );
}

const initialData = async (userId: string) => {
  try {
    
    const boardRef = doc(db, `users/${userId}/boards`, 'primerboardid');
    const initialBoard = {
      idBoard: 'primerboardid',  
      nameBoard: 'Tablero de ejemplo',
    }
    await setDoc(boardRef, initialBoard);
    console.log('tableros creado exitosamente');

    const specificBoardRef = doc(db, `users/${userId}/boards/primerboardid`);
    const listsRef = doc(collection(specificBoardRef, 'lists'), 'primerlistid');
    
    const initialList = {
      idList: 'primerlistid',
      nameList: 'lista de ejemplo',
      colorList: '#252526',
      order: 0,
      archived: false
    };

    await setDoc(listsRef, initialList);

    console.log('lista creada exitosamente');

    const cardsRef = doc(collection(listsRef, 'cards'), 'primercardid');

    const initialCard = {
      idCard: 'primercardid',
      nameCard: 'card de ejemplo',
      coverColorCard: '#FD7E14',
      coverImgCard: null,
      coverCardImgs: [],
      complete: false,
      description: '',
      order: 0,
      archived: false
    };

    await setDoc(cardsRef, initialCard);
    console.log('tarjeta creada exitosamente');

    await Promise.all(initialTags.map(async tag => {
      const tagRef = doc(collection(db, `users/${userId}/tags`), tag.idTag);
      await setDoc(tagRef, tag);
    }));
    
    console.log("Tablero, lista, tarjeta y etiquetas creados exitosamente.");

  } catch(error) {
    console.log(error);
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
    
    return true;
  } catch(error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw {
        field: 'email',
        message: 'Este correo ya está registrado',
      };
    } else if (error.code === 'auth/invalid-email') {
      throw {
        field: 'email',
        message: 'Formato de correo inválido',
      };
    } else if (error.code === 'auth/weak-password') {
      throw {
        field: 'password',
        message: 'La contraseña es demasiado débil',
      };
    } else {
      throw {
        field: '',
        message: 'Ocurrió un error durante el registro',
      };
    }
  }
}

export const userLogin = async ({email, password}: {email: string, password: string}) => {
  return signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log('usuario logeado correctamente: ', user)
    return true;
  })
  .catch((error) => {
    const errorCode = error.code.trim();
    const errorMessage = error.message;
    console.log('error login errorCode: ', errorCode);
    console.log('error login message: ', errorMessage);
    switch (error.code) {
      case 'auth/invalid-email':
        throw {
          field: 'email',
          message: 'El formato del correo electrónico no es válido.'
        };
      case 'auth/too-many-requests':
        throw {
          field: 'email',
          message: 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde.'
        }
      case 'auth/invalid-credential':
        throw {
          field: '',
          message: 'Credenciales invalidas, porfavor verifica tu correo y contraseña.'
        }
      default:
        throw {
          field: '',
          message: 'Ocurrió un error inesperado. Inténtalo más tarde.'
        }
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

export const getBoardsFirebase = async () => {
  const userId = auth.currentUser?.uid;
  const boardsCollection = collection(db, `users/${userId}/boards`);
  const boardsSnapshot = await getDocs(boardsCollection);
  const boards = boardsSnapshot.docs.map((doc) => doc.data() as BoardProps);
  return boards;
}

export const getListsFirebase = async (idBoard: string) => {
  const userid = auth.currentUser?.uid;
  const listsCollection = collection(db, `users/${userid}/boards/${idBoard}/lists`);

  const q = query(listsCollection, orderBy('order'))

  const listsSnapshot = await getDocs(q);
  const lists = listsSnapshot.docs.map((doc) => doc.data() as ListProps);

  return lists;
}

export const getCardsFirebase = async (idBoard: string, idList: string) => {
  const userId = auth.currentUser?.uid;
  const cardsCollection = collection(db, `users/${userId}/boards/${idBoard}/lists/${idList}/cards`);

  const q = query(cardsCollection, orderBy('order'));

  const cardsSnapshot = await getDocs(q);

  const cards = cardsSnapshot.docs.map(doc => doc.data() as CardProps);
  return cards;
}

export const getTagsFirebase = async () => {
  const userId = auth.currentUser?.uid;
  const tagsCollection = collection(db, `users/${userId}/tags`);
  const tagsSnapshot = await getDocs(tagsCollection);
  return tagsSnapshot.docs.map(doc => doc.data() as TagsProps);
}