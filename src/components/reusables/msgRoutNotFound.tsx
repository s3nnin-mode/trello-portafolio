import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../customHooks/useAuthContext";
import '../../styles/components/reusables/msgRoutNotFound.scss';

const typeElementsEs = {
  card: 'Tarjeta',
  board: 'Tablero'
}

export const MsgRoutNotFound = ({routToElement}:{routToElement: 'card' | 'board'}) => {
  const { userAuth } = useAuthContext();
  const location = useLocation();
  
  return (
    <div className='msg_is_board_not_found inter'>
      <h1>{typeElementsEs[routToElement]} no encontrad{routToElement === 'board' ? 'o' : 'a'}</h1>

      {userAuth 
        ? <p className='text_rout_not_found'>Ruta al que intentas acceder estando logeado: <span>{location.pathname}</span></p>
        : <p className='text_rout_not_found'>Ruta al que intentas acceder desde el modo demo: <span>{location.pathname}</span></p>
      }

      <ol>
        <li>
          Es posible que estés accediendo a {routToElement === 'board' ? 'un tablero' : 'una tarjeta'} mediante una una ruta guardada en el navegador 
          que corresponde a un modo anterior (como la Demo o una Cuenta).
        </li>
        <li>
          {routToElement === 'board' ? 'El tablero' : 'La tarjeta'} no existe.
        </li>
        <li>
          Es algún error de servidor. De ser asi, intenta refrescar la pagina o acceder al tablero desde la sección de tableros.
        </li>
      </ol>

      <p>
        Por lo general la ruta de los tableros y tarjetas se base en su mismos nombres, verifica si la ruta coincide con el nombre de uno de tus tableros o tarjetas.
        <br />
        <br />
        Si el problema persiste, avisame por correo: leyderlevel1@gmail.com
      </p>
    </div>
  );
}