import { useState } from "react";
import '../styles/sidebar.scss';
import { MdLeaderboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
    const [sidebar, setSidebar] = useState(true);
    const toggleSidebar = () => setSidebar(!sidebar);
    const navigate = useNavigate();

    return (
        <div className={sidebar ? 'sidebar' : 'sidebar-desactive'}>
            <header className='sidebar-header'>
                <div className='logo-and-text'>
                    <img src='https://narutoversity.wordpress.com/wp-content/uploads/2017/03/senjutsu.png?w=640' alt='logo app'/>
                    <p className='monserrat'>Espacio de trabajo </p>
                </div>
                
                <button className='btn-open-close-sidebar' onClick={toggleSidebar}>
                    <i className={`bi bi-arrow-${sidebar ? 'left' : 'right'}`}></i>
                </button>
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