import { useEffect } from "react";
import '../../../src/styles/components/routes/start.scss';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useBoardsStore } from "../../store/boardsStore";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { getBoardsFirebase } from "../../services/firebase/firebaseFunctions";
import { initialTagsDemo } from "../../utils/tagsColors";
import { Button, Fade } from "@mui/material";

export const Start = () => {
  const { userAuth } = useAuthContext();
  const { loadBoards } = useBoardsStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('test para ver cuantas veces se renderiza');
    const LS = localStorage.getItem('boards-storage');

    const fetchData = async () => {
      if (userAuth) {
        const boards = await getBoardsFirebase();
        loadBoards(boards);
        navigate('/kanbaX');
        console.log('user auth en start')
      } else if (LS) {  
          loadBoards(JSON.parse(LS));
          navigate('/kanbaX'); 
          console.log('hay LS en start')
      } else {
        console.log('no hay LS ni UserAuth');
      }
    }
    fetchData();
  }, [userAuth]);

  //como demo al principio se debe agregar al menos un tablero, lista y tarjeta con un par de etiquetas
  //para que se pueda visualizar algo en la aplicación y que el usuario pueda entender su funcionamiento
  //La demostracion tiene que ser con un tema especifico y no solo 'tablero de demostracion' o 'lista de demostracion',
  //sino con un tema que pueda ser de interes para el usuario

  const demo = () => {
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
        order: 0
      },
      {
        idCard: 'cardDemoHabitacionNiños',
        nameCard: 'Habitación de los niños',
        coverColorCard: '#FF9F40',
        coverCardImgs: [],
        coverImgCard: null,
        complete: false,
        description: 'La habitación de los niños puedes dejarlo al final',
        order: 10
      },
      {
        idCard: 'cardDemoBaño',
        nameCard: 'Baño',
        coverColorCard: '#FD7E14',
        coverCardImgs: [],
        coverImgCard: null,
        complete: false,
        description: 'El baño es de lo más importante, no lo olvides',
        order: 20
      }
    ]
    }]));
    
    localStorage.setItem('tags-storage', JSON.stringify(initialTagsDemo));
    navigate('/kanbaX');
  }

  const isStart = location.pathname.includes('/auth');

  return (
    <div className='container_route_auth'>
      <Fade in={isStart} timeout={600} >
        <div className='intro'>
          <h4 className='inter_title'>
            Elige entre registrarte para una experiencia personalizada o probar la funcionalidad de la aplicación mediante una cuenta demo.                  
          </h4>
          <p className='montserrat'>
            Si decides usar la demo, los datos se guardarán temporalmente en tu navegador mediante localStorage, 
            lo que te permitirá explorar las características de la aplicación sin necesidad de crear una cuenta. 
            ¡Elige tu opción y empieza a explorar!
          </p>
          <Button sx={{backgroundColor: 'orange'}} onClick={demo} variant="contained">
            Usar modo Demo
          </Button>
        </div>
      </Fade>
      <div className='container_forms'> 
        <Outlet />
      </div>
    </div>
  )
}