import '../../App.css';
import { Route, Routes, useNavigate } from "react-router-dom"
import { Sidebar } from "../boards/sidebar";
import { Tableros } from "../boards/boards";
import { Tablero } from "../boards/board";
import { useEffect } from 'react';
import { useBoardsStoree } from '../../store/boardsStore';
import { useAuthContext } from '../../customHooks/useAuthContext';

export const KanbaX = () => {
    const { userAuth } = useAuthContext();
    const { setBoards } = useBoardsStoree();
    const navigate = useNavigate();

    useEffect(() => {
        const LS = localStorage.getItem('boards-storage');
        if (userAuth) {
        // Cargar desde Firebase
        // setBoards([...firebase])
        } else if (LS) {
            console.log('LS en ruta kanbaX: ', LS)
            setBoards(JSON.parse(LS));
        } else {
            navigate('/')
        }
    }, []);

    return (
        <div className='App'>
            <Sidebar />
            <Routes>
                <Route path='/' element={<Tableros />} />
                <Route path='/:currentIdBoard' element={<Tablero />}/>
            </Routes>
        </div>
    )
}