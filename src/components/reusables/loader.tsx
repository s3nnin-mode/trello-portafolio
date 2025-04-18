import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface LoaderProps {
  open: boolean
  bgColor?: string
}

export const Loader: React.FC<LoaderProps> = ({open, bgColor}) => {

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ bgColor, color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
