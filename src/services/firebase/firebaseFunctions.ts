import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./firebaseConfig";

export const userRegister = async ({email, password}: {email: string, password: string}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log('Usurio registrado correctamente', userCredential.user);
  
    //   await setDoc(doc(db, 'users', uid), {
    //     name: nombre,
    //     email: correo,
    //     photoUrl: '',
    //     coord: {lat: 16.868, lon: -99.894},
    //     history: []
    //   });
  
       await signOut(auth);
      
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