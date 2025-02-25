import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaUserAlt } from "react-icons/fa";
import '../../../styles/components/boards/sidebarComponents/userModal.scss';
import { Avatar, IconButton, Input, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import { FaEdit, FaCheck } from "react-icons/fa";

import { IoCloseSharp } from "react-icons/io5";
import { useForm } from 'react-hook-form';

export const UserModal = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [editingName, setEditingName] = useState(false);
  const [inputName, setInputName] = useState('test');

  const handleChangeName = () => {
    
  }

  return (
    <>
      <Button onClick={handleShow}>
        <FaUserAlt /> user name
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            {/* <FaUserAlt className='photo_user'/> */}
          <Modal.Title>Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Avatar>
              <FaUserAlt />
            </Avatar>
          </div>

          <ListItem className='container_user_name_info' disablePadding>
            {
              editingName 
              ? 
              <TextField 
              fullWidth 
              value={inputName}
              variant='standard'
              onChange={(e) => setInputName(e.target.value)}
              type='text'
               />
              :
              <ListItemText className='user_name' primary='user name'/>
            }
            <IconButton className='btn_edit_name' onClick={() => setEditingName(true)}>
              {
                editingName 
                ?
                <>
                  <FaCheck onClick={handleChangeName}/>
                  <IoCloseSharp /> 
                </>
                :
                <FaEdit />
              }
            </IconButton>
          </ListItem> 

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserModal;