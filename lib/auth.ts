import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { auth } from './firebase'

export async function signInWithEmail(email: string, password: string, isSignUp: boolean = false) {
  if (!auth) throw new Error('Firebase auth not initialized')
  
  if (isSignUp) {
    return await createUserWithEmailAndPassword(auth, email, password)
  } else {
    return await signInWithEmailAndPassword(auth, email, password)
  }
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase auth not initialized')
  
  const provider = new GoogleAuthProvider()
  return await signInWithPopup(auth, provider)
}

export async function signOut() {
  if (!auth) throw new Error('Firebase auth not initialized')
  
  return await firebaseSignOut(auth)
}

export { auth }