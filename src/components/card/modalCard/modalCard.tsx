import '../../../styles/components/card/modalCard/modalCard.scss';
import { BoardProps, ListProps, CardProps } from '../../../types/boardProps';
//COMPONENTS
import { CardModalCover } from "./modalComponents/cover/cardModalCover";
import { BtnOpenTags } from "./modalComponents/btnOpenTags/btnOpenTags";
import { TitleModalCard } from "./modalComponents/titleModalCard";
import { BtnRemoveCard } from "./modalComponents/btnOpenTags/btnRemoveCard";
import { ActiveTags } from "./activeTags";
import { CardDescription } from './modalComponents/cardDescription';
import { useRef, useState } from 'react';

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface ModalTargetComponentProps {
    card: CardProps
    list: ListProps
    board: BoardProps
    closeModal: () => void
    open: boolean
}

export const CardModal: React.FC<ModalTargetComponentProps> = ({ card, list, board, closeModal, open }) => {
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
		const style = {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: 500,
			border: '2px solid #000',
			backdropFilter: 'blur(10px)',
			// background: 'rgba(255, 255, 255, .02)',
			boxShadow: 24,
			p: 2,
		};
	return (
		<div className='div_modal'>
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
				<Box sx={{...style}} className='card_modal'>
					{/* <Typography id="transition-modal-title" variant="h6" component="h2">
						Text in a modal
					</Typography> */}
					<CardModalCover card={card} idBoard={board.idBoard} idList={list.idList} closeModal={closeModal} />
					<Typography id="transition-modal-description" sx={{ mt: 2, color: '#ccc' }}>
						Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
					</Typography>
					<Button onClick={closeModal}>Close</Button>
				</Box>
			</Fade>
		</Modal>
	</div>
	)
}

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