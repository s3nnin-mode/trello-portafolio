import { useState } from "react";
import '../../styles/components/boards/sidebar.scss';
import { MdLeaderboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { auth } from '../../services/firebase/firebaseConfig';
import { UserModal } from "./sidebarComponents/userModal";

export const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);
  const toggleSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();

  return (
    <div className={sidebar ? 'sidebar' : 'sidebar-desactive'}>
      <header className='sidebar_header'>
        <UserModal />
        
        <button className='btn-open-close-sidebar' onClick={toggleSidebar}>
          <i className={`bi bi-arrow-${sidebar ? 'left' : 'right'}`}></i>
        </button>
        <p>
          {
            auth ? 'usuario autenticado' : 'sin usuario'
          }
        </p>
      </header>

      <div>
        <button className='btn-boards' onClick={() => navigate('/')}>
          <MdLeaderboard className='icon-board' />
          Boards
        </button>
      </div>
    </div>
  )
}