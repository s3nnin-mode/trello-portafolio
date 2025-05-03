import { useEffect, useState } from "react";
import '../../styles/components/boards/sidebar.scss';
import '../../App.css';

import { MdChevronRight } from "react-icons/md";
import { MdArchive } from "react-icons/md";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { styled, useTheme } from "@mui/material/styles";
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
import { useMediaQuery } from "@mui/material";
import { ArchivedElements } from "../reusables/archivedElements";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }: { theme?: any; open?: boolean }) => ({  //theme?: any; open?: boolean quitado por el momento
  width: 0,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        "& .MuiDrawer-paper": { 
          width: drawerWidth, 
          backgroundColor: '#1E1E1E', 
          transition: '.3s linear',
          color: 'white',
          border: 'none'
        },
      }
    : {
        "& .MuiDrawer-paper": { 
          width: 60,
          backgroundColor: '#1E1E1E',
          transition: '.3s linear' ,
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
  const location = useLocation();
  const { currentIdBoard } = useParams();
  const [showArchivedElements, setShowArchivedElements] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const logout = async () => {
    const logoutState = await logoutFirebase();
    if (logoutState) {
      navigate('/');
    }
  }

  useEffect(() => {
    console.log('location', location);
    console.log('params', currentIdBoard);
    
  },[location, currentIdBoard]);

  return (
    <Box
      className='container_sidebar'
      sx={{
        display: isMobile && currentIdBoard ? 'none' : 'flex', // para pantallas medianas en adelante, 
        ml: isMobile && currentIdBoard ? '0px' : open ? '240px' : '55px', // para pantallas medianas en adelante,
        transition: '.3s linear',
      }}
    >
      {showArchivedElements && currentIdBoard && (
        <ArchivedElements idBoard={currentIdBoard} close={() => setShowArchivedElements(false)} />
      )}
      <Drawer className='container_drawer' variant='permanent' open={open}>
        <DrawerHeader className='header_drawer'>
          <h1 className='inter_title'>KanbaX</h1>
          <IconButton onClick={() => setOpen(!open)}>
            { open ? <MdChevronLeft className='collapse_sidebar' style={{color: 'white'}}/> : <MdChevronRight className='open_sidebar' style={{color: 'white'}} /> }
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List className='container_btns_sidebar' sx={{overflow: 'hidden'}}>
          <ListItem className='btn_sidebar' disablePadding >
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
          {currentIdBoard && (
            <ListItem className='btn_sidebar' disablePadding >
              <ListItemButton onClick={() => setShowArchivedElements(true)}>
                <ListItemIcon sx={{color: '#ccc'}}>
                  <MdArchive />
                </ListItemIcon>

                {open && <ListItemText 
                  primary={'Archivados'} 
                  slotProps={{
                    primary: {
                      className: 'inter'
                    },
                  }}
                />}
              </ListItemButton>
            </ListItem>
          )}
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