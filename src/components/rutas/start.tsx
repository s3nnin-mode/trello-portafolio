import { useEffect, useState } from "react";
import '../../../src/styles/components/routes/start.scss';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { initialTagsDemo } from "../../utils/tagsColors";
import { Button, Fade } from "@mui/material";
import { Loader } from "../reusables/loader";

export const Start = () => {
  const { getUserAuthState } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);
  const LS = localStorage.getItem('boards-storage');

  useEffect(() => {
    console.log('test para ver cuantas veces se renderiza');

    const fetchData = async () => {
      const user_auth = await getUserAuthState();
      if (user_auth) {
        // const boards = await getBoardsFirebase();
        // loadBoards(boards);
        navigate('/kanbaX');
        console.log('user auth en start');
        return
      }
      
      setLoader(false);
      // if (LS) {

      // }
        //   else if (LS) {  
        //     loadBoards(JSON.parse(LS));
        //     navigate('/kanbaX'); 
        //     console.log('hay LS en start')
        // } else {
        //   console.log('no hay LS ni UserAuth');
        // }
    }
    fetchData();
  }, []);

  //como demo al principio se debe agregar al menos un tablero, lista y tarjeta con un par de etiquetas
  //para que se pueda visualizar algo en la aplicación y que el usuario pueda entender su funcionamiento
  //La demostracion tiene que ser con un tema especifico y no solo 'tablero de demostracion' o 'lista de demostracion',
  //sino con un tema que pueda ser de interes para el usuario

  const demo = () => {
    if (LS) {
      navigate('/kanbaX');
      return;
    }

    localStorage.setItem('boards-storage', JSON.stringify([
      {
        idBoard: 'TableroDemo', nameBoard: 'Tablero de ejemplo: Limpiar la casa'
      }]
    ));

    localStorage.setItem('lists-storage', JSON.stringify([{
      idBoard: 'TableroDemo',
      lists: [{
        idList: 'ListaDemo',
        nameList: 'Limpieza de habitaciones',
        colorList: '#252526',
        order: 0        
      }]
    }]));

    localStorage.setItem('cards-storage', JSON.stringify([{
      idBoard: 'TableroDemo',
      idList: 'ListaDemo',
      cards: [{
        idCard: 'cardDemoHabitacionPrincipal',
        nameCard: 'Habitación principal',
        coverColorCard: '#E63946',
        coverImgCard: 'https://media.istockphoto.com/id/1300331505/es/vector/sal%C3%B3n-interior-c%C3%B3modo-sof%C3%A1-estanter%C3%ADa-silla-y-plantas-de-la-casa-ilustraci%C3%B3n-de-dibujos.jpg?s=612x612&w=0&k=20&c=IaqHAuS45tNGll3JI47u-NgCGJwc1Kmpg1UJD5KiSug=',
        coverCardImgs: ['https://www.prisma.org.pe/wp-content/uploads/home-office-mujer-800x480.png', 'https://media.istockphoto.com/id/1300331505/es/vector/sal%C3%B3n-interior-c%C3%B3modo-sof%C3%A1-estanter%C3%ADa-silla-y-plantas-de-la-casa-ilustraci%C3%B3n-de-dibujos.jpg?s=612x612&w=0&k=20&c=IaqHAuS45tNGll3JI47u-NgCGJwc1Kmpg1UJD5KiSug='],
        complete: false,
        description: 'La habitación principal necesita ser limpiada con urgencia',
        order: 0,
        archived: false
      },
      {
        idCard: 'cardDemoHabitacionNiños',
        nameCard: 'Habitación de los niños',
        coverColorCard: '#FF9F40',
        coverCardImgs: [],
        coverImgCard: null,
        complete: false,
        description: 'La habitación de los niños puedes dejarlo al final',
        order: 10,
        archived: false
      },
      {
        idCard: 'cardDemoBaño',
        nameCard: 'Baño',
        coverColorCard: '#FD7E14',
        coverCardImgs: [],
        coverImgCard: null,
        complete: false,
        description: 'El baño es de lo más importante, no lo olvides',
        order: 20,
        archived: false
      }
    ]
    }]));
    
    localStorage.setItem('tags-storage', JSON.stringify(initialTagsDemo));
    navigate('/kanbaX');
  }

  const isStart = location.pathname.includes('/auth');

  if (loader) {
    return <Loader open={true} bgColor='black' />
  }

  return (
    <div className='container_route_auth'>
      <Fade in={isStart} timeout={600} >
        <div className='intro'>
          <h3 className='inter_title'>
            Elige entre registrarte para una experiencia personalizada o probar la funcionalidad de la aplicación mediante una cuenta demo.                  
          </h3>
          <p className='inter'>
            Si decides usar la demo, los datos se guardarán temporalmente en tu navegador mediante localStorage, 
            lo que te permitirá explorar las características de la aplicación sin necesidad de crear una cuenta.
            <br /> 
            Elige lo que mejor se adapte a ti.            
          </p>
          {LS && <span className='inter'>El modo demo ya está activo en este dispositivo.</span>}
          <Button 
            onClick={demo} 
            variant="contained"
          >
            { LS ? 'Seguir en modo demo' : 'Usar modo Demo' }
          </Button>
        </div>
      </Fade>
      <div className='container_forms'>
        <Outlet />
      </div>
    </div>
  )
}