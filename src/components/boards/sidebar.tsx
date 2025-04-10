import { useState } from "react";
import '../../styles/components/boards/sidebar.scss';
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

  return (
    <Box sx={{display: 'flex', ml: open ? '240px' : '60px', transition: '.3s linear'}}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(!open)}>
            { open ? <MdChevronLeft style={{color: 'white'}}/> : <MdChevronRight style={{color: 'white'}} /> }
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/kanbaX')}>
              <ListItemIcon>
                <IoClipboardSharp style={{color: '#03DAC5'}} />
              </ListItemIcon>
              {open && <ListItemText primary={'Tableros'} />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};