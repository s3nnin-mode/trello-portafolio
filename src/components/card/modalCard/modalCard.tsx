import '../../../styles/components/card/modalCard/modalCard.scss';
import { BoardProps, ListProps, CardProps } from '../../../types/boardProps';
//COMPONENTS
import { CardModalCover } from "./modalComponents/cover/cardModalCover";
import { TitleModalCard } from "./modalComponents/titleModalCard";
import { ActiveTags } from "./activeTags";
import { CardDescription } from './modalComponents/cardDescription';

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

interface ModalTargetComponentProps {
  card: CardProps
  list: ListProps
  board: BoardProps
  closeModal: () => void
  open: boolean
}

export const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  return `rgb(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, .4)`;
}

export const CardModal: React.FC<ModalTargetComponentProps> = ({ card, list, board, closeModal, open }) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    // backdropFilter: 'blur(5px)',
    // background: 'rgba(255, 255, 255, .01)',
    background: hexToRgb(list.colorList),
    boxShadow: 24,
    p: 2,
  };

	return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={closeModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 350,
        },
      }}
    >
    <Fade in={open}>
      <Box 
        sx={{
          ...style,
          // willChange: 'transform'
        }}
        className='card_modal'>
        <CardModalCover card={card} idBoard={board.idBoard} idList={list.idList} closeModal={closeModal} />
        <TitleModalCard board={board} list={list} card={card} />

        {/*CONTENIDO*/}
        
        <div className='modal_content_container'>         
          <div className='modal_content'>
            <ActiveTags board={board} list={list} card={card} />   
            <CardDescription card={card} idList={list.idList} idBoard={board.idBoard} />
          </div>
          <div className='sidebar_tags'>
            
          </div>
        </div>
      </Box>
    </Fade>
  </Modal>
	)
}

{/* <Typography id="transition-modal-description" sx={{ mt: 2, color: '#ccc' }}>
						Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
					</Typography> */}

 // <div className='modal_show' onPointerDown={(e) => e.stopPropagation()}>
        //     <CardModalCover card={card} idBoard={board.idBoard} idList={list.idList} closeModal={closeModal} />

        //     <div className='btns_modal'>             {/*SIDEBAR*/}
        //         <BtnOpenTags board={board} list={list} card={card} />
        //         <button className='btn_modal_sidebar'>Editar</button>
        //         <BtnRemoveCard idBoard={board.idBoard} list={list} card={card} />
        //     </div>

        //     <TitleModalCard board={board} list={list} card={card} />
            
        //     <div className='modal_content_container'>         {/*CONTENIDO*/}
        //         <div className='modal_content'>
        //             <div>
        //                 <CardDescription card={card} idList={list.idList} idBoard={board.idBoard} />
        //             </div>
        //         </div>
        //         <div className='sidebar_tags'>
        //             <ActiveTags board={board} list={list} card={card} />   
        //         </div>
        //     </div>
        // </div>