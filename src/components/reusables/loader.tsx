import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface PropsLoader {
    open: boolean
}

export const Loader = ({open}: {open: boolean}) => {
//   const [open, setOpen] = React.useState(false);
//   const handleClose = () => {
//     setOpen(false);
//   };
//   const handleOpen = () => {
//     setOpen(true);
//   };

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
