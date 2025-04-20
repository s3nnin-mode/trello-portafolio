import { useState } from "react";
import '../../styles/components/boards/sidebar.scss';
import '../../App.css';

import { MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { MdChevronLeft } from "react-icons/md";
import { IoClipboardSharp } from "react-icons/io5";
import { FiLogIn } from 'react-icons/fi';
import { useAuthContext } from "../../customHooks/useAuthContext";
import { logoutFirebase } from "../../services/firebase/firebaseFunctions";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }: { theme?: any; open?: boolean }) => ({  //theme?: any; open?: boolean quitado por el momento
  width: 15,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        "& .MuiDrawer-paper": { 
          width: drawerWidth, 
          backgroundColor: '#1E1E1E', 
          transition: '.3s linear',
          color: 'white' 
        },
      }
    : {
        "& .MuiDrawer-paper": { 
          width: 60,
          backgroundColor: '#1E1E1E',
          transition: '.3s linear' 
        },
      }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { userAuth } = useAuthContext();

  const logout = async () => {
    const logoutState = await logoutFirebase();
    if (logoutState) {
      navigate('/');
    }
  }

  return (
    <Box sx={{display: 'flex', ml: open ? '240px' : '60px', transition: '.3s linear',}}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(!open)}>
            { open ? <MdChevronLeft style={{color: 'white'}}/> : <MdChevronRight style={{color: 'white'}} /> }
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{overflow: 'hidden'}}>
          <ListItem disablePadding >
            <ListItemButton onClick={() => navigate('/kanbaX')}>
              <ListItemIcon sx={{color: '#ccc'}}>
                <IoClipboardSharp />
              </ListItemIcon>

              {open && <ListItemText 
                primary={'Tableros'} 
                slotProps={{
                  primary: {
                    className: 'inter' //Falta arreglar la fuente de los items
                  },
                }}
              />}
            </ListItemButton>
          </ListItem>
          { !userAuth ? (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/auth/login')}>
                <ListItemIcon sx={{color: '#ccc'}}>
                  <FiLogIn />
                </ListItemIcon>
                {open && <ListItemText primary={'Iniciar sesión'} />}
              </ListItemButton>
            </ListItem>
            )
            :
            (
              <ListItem disablePadding>
                <ListItemButton onClick={logout} >
                  <ListItemIcon sx={{color: '#ccc'}}>
                    <FiLogIn />
                  </ListItemIcon>
                  {open && <ListItemText primary={'Cerrar sesión'} />}
                </ListItemButton>
              </ListItem>
            )
          }
        </List>
      </Drawer>
    </Box>
  );
};