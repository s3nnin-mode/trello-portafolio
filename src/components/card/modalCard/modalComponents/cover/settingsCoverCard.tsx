import { useEffect, useState } from 'react';
import '../../../../../styles/components/card/modalCard/modalComponents/cover/settingsCoverCard.scss';
import { CardProps } from '../../../../../types/boardProps';
import { useCardsServices } from '../../../../../services/cardsServices';
// import { useAuthContext } from '../../../../../customHooks/useAuthContext';
// import { updateCoverCard } from '../../../../../services/firebase/updateData/updateCards';
import { IoIosArrowBack } from "react-icons/io";
// import { IoMdClose } from 'react-icons/io';
import { AiOutlinePicture } from "react-icons/ai";
// const colors = [
//     "#E63946", "#F4A261", "#2A9D8F", "#264653", "blue",
//     "#F39C12", "#16A085", "#2980B9", "#D35400", "#C0392B",
//     "#3498DB", "#27AE60", "#8E44AD", "#F1C40F", "#2C3E50",
//     "#E67E22", "#1ABC9C", "#9B59B6", "#34495E", "#E74C3C", 'grey'
// ];

const cardColors = [
  "#007BFF", "#FFC107", // Azul eléctrico & Amarillo dorado
  "#6F42C1", "#FD7E14", // Púrpura intenso & Naranja vibrante
  "#28A745", "#DC3545", // Verde esmeralda & Rojo coral
  "#20C997", "#E83E8C", // Turquesa & Rosa fucsia
  "#343A40", "#F8F9FA", // Gris oscuro & Blanco humo
  "#A78BFA", "#A3E635", // Lavanda & Lima pastel
  "#0DCAF0", "#FF9F40", // Cian vibrante & Durazno
  "#80C904", "#212529", // Verde manzana & Negro profundo
  "#E63946", "#B35C00", // Rojo lava & Marrón otoño
  "#17A2B8", "#C08497"  // Aqua & Malva suave
];

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

// const style = {
//   // position: 'fixed',
//   // top: 0,
//   // left: 0,
//   // // transform: 'translate(-50%, -50%)',
//   // width: '100%',
//   // background: '#121212',
//   // boxShadow: 24,
//   // overflow: 'auto',
//   // p: 2,
// };
  
interface SettingsCoverProps {
  idBoard: string
  idList: string
  card: CardProps
  closeComponent: () => void
  openSettingsCover: boolean
}

export const SettingsCover: React.FC<SettingsCoverProps> = ({ card, idList, idBoard, closeComponent, openSettingsCover}) => {
  const { cardsServices } = useCardsServices();
  // const { userAuth } = useAuthContext();
  // const [file, setFile] = useState<File | undefined>(); //este file es para firebase sino mal recuerdo
  const [limitColors, setLimitColors] = useState(8);
  const [coverColorPreview, setCoverColorPreview] = useState<string | null>(null);             //coverPreview será el color o la url de la imagen
  const [coverImgPreview, setCoverImgPreview] = useState<string | null>(null);
  const [colorSelect, setColorSelect] = useState<string | null>(null);

  useEffect(() => {
    if (card.coverColorCard) {
      setCoverColorPreview(card.coverColorCard);
      setColorSelect(card.coverColorCard);
    }
    if (card.coverImgCard) {
      setCoverImgPreview(card.coverImgCard);
    }
  }, []);

  if (!card) return;

  const handleUpdateImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];  //file
    if (!file) return;
    // setFile(file);
    setCoverImgPreview(URL.createObjectURL(file));
  }

  const handleSaveChanges = () => {
    const idCard = card.idCard;
    // if (userAuth) {
    //   updateCoverCard({
    //     idBoard, 
    //     idList, 
    //     idCard, 
    //     type: coverType, 
    //     cover: coverType === 'img' && file ? file : coverPreview
    //   });
    // }
    if (colorSelect !== card.coverColorCard) {
      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => 
          (cardGroup.idBoard === idBoard && cardGroup.idList === idList) ?
            { ...cardGroup,
              cards: cardGroup.cards.map((card) => 
                card.idCard === idCard ?
                { ...card, coverColorCard: colorSelect} :
                card
              )
            } :
            cardGroup
        )
      });
    }

    if (coverImgPreview !== card.coverImgCard) { //aqui falta verificar si coverImgPreview concuerda con los datos de una imagen
      cardsServices({
        updateFn: (cardsGroup) => cardsGroup.map((cardGroup) => 
          (cardGroup.idBoard === idBoard && cardGroup.idList === idList) ?
            { ...cardGroup,
              cards: cardGroup.cards.map((card) => 
                card.idCard === idCard ?
                { ...card, coverImgCard: coverImgPreview} :
                card
              )
            } :
            cardGroup
        )
      });
    }
    closeComponent();
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openSettingsCover}
      onClose={closeComponent}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 350,
        },
      }}
    >
      <Fade in={openSettingsCover}>
        <Box 
          // sx={{...style}} 
          className='backdrop_settings_cover'>
          <div className='settings_card_cover' onPointerDown={(e) => e.stopPropagation()}>
            <header className='header_preview_cover_card'> 
              
              {/* <div className='color_maker_and_btn_close'>
                <div className='container_color_maker'> 
                  {
                    coverColorPreview !== null ?
                    <>
                      <div style={{backgroundColor: coverColorPreview}} />
                      <div style={{backgroundColor: coverColorPreview}} />
                    </> :
                    <span style={{fontStyle: 'italic'}}>Sin indicador visual</span>
                  }
                </div>
                <button onClick={closeComponent}>
                  <IoIosArrowBack />
                </button>
              </div> */}

              <div className='container_color_indicator'> 
                {
                  coverColorPreview !== null ?
                  <>
                    <div style={{backgroundColor: coverColorPreview}} />
                    <div style={{backgroundColor: coverColorPreview}} />
                  </> :
                  <span style={{fontStyle: 'italic'}}>Sin indicador visual</span>
                }
              </div>

              <button onClick={closeComponent}>
                <IoIosArrowBack />
              </button>
              
              {
                coverImgPreview ?
                <img src={coverImgPreview} alt='portada de card' /> :
                <AiOutlinePicture className='icon_no_img_cover' />
              }
                {/* {
                  coverType === 'color' ?
                  <div style={{backgroundColor: coverPreview}} className='color_preview' /> :
                  <img src={coverPreview} alt='cover card' />
                } */}
            </header>
            <main>
              <div className='colors_to_cover'>
                <p className='roboto'>
                  Selecciona un color para tu tarjeta: 
                  <br/> 
                  <span> Se mostrará con dos círculos de color como indicador visual</span>
                </p>
                <div>
                  {
                    cardColors.slice(0, limitColors).map((color) => (
                      <button 
                        key={color}
                        // className='btn_select_color_preview'
                        onClick={() => setColorSelect(color)}
                        onMouseEnter={() => setCoverColorPreview(color)}
                        onMouseLeave={() => setCoverColorPreview(colorSelect)}
                        className={color === colorSelect ? 'btn_color_selected' : 'btn_select_color_preview'}
                        style={{
                            backgroundColor: color, 
                        }}
                      />
                    ))
                  }
                </div>
                <div className='actions_colors'>
                  {
                    limitColors === 8 ?
                    <button className='btn_toggle_limitColors' onClick={() => setLimitColors(20)}>Ver más colores</button>  :
                    <button className='btn_toggle_limitColors' onClick={() => setLimitColors(8)}>Ocultar colores</button>
                  }
                  <button 
                    className='btn_remove_indicator roboto' 
                    onClick={() => {setColorSelect(null); setCoverColorPreview(null)}} 
                    >
                      Quitar indicador
                  </button>    
                </div>  
              </div>

              <div className='container_setting_cover_imgs'>
                <p className='roboto'>
                  Selecciona una imagén para portada de tu tarjeta: 
                  <br />
                  
                </p>
                <div className='actions_cover_img'>
                  <label htmlFor='inputFile' className='roboto' aria-disabled>Cargar imagen</label>
                  <input disabled type='file' id='inputFile' onChange={(e) => handleUpdateImg(e)} style={{display: 'none'}} />
                  <button onClick={() => setCoverImgPreview(null)}>Quitar imagen</button>
                </div>

                <div className='cover_imgs_container'>
                  {
                    card.coverCardImgs !== undefined && (
                      card.coverCardImgs.map((img) => {
                        return (
                        <button 
                        onClick={() => setCoverImgPreview(img)} 
                        key={img}>
                          <img src={img} alt='cover card' />
                        </button>)
                      })
                    )              
                  }
                </div>
                <span style={{color: 'orange', fontStyle: 'italic'}}>
                  La opción para agregar una imagen desde tu PC estará disponible pronto, pero solo para usuarios con una cuenta.
                  </span>
              </div>
            </main>
            <footer>
              <button onClick={handleSaveChanges}>Guardar cambios</button>
              <button onClick={closeComponent}>Cancelar</button>
            </footer>
          </div>
        </Box>
      </Fade>
    </Modal>
  )
}