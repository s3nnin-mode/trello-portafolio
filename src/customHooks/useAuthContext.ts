import { useContext } from "react";
import { AuthContext } from "../contextos/authUser";

export const useAuthContext = () => {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('no puedes usar el contexto fuera de app');
  }

  return contexto
}