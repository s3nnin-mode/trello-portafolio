import '../../App.css';
import { Route, Routes, useNavigate } from "react-router-dom"
import { Sidebar } from "../boards/sidebar";
import { Tableros } from "../boards/boards";
import { Tablero } from "../boards/board";
import { useEffect } from 'react';
import { useBoardsStore } from '../../store/boardsStore';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { useListsStore } from '../../store/listsStore';
import { useCardsStore } from '../../store/cardsStore';
import { useTagsStore } from '../../store/tagsStore';

export const KanbaX = () => {
    const { userAuth, fetchData } = useAuthContext();
    const { loadBoards } = useBoardsStore();
    const { loadLists } = useListsStore();
    const { loadCards } = useCardsStore();
    const { loadTags } = useTagsStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (userAuth) {
            fetchData();
            return
        }

        const boardsLS = localStorage.getItem('boards-storage');
        const listsLS = localStorage.getItem('lists-storage');
        const cardsLS = localStorage.getItem('cards-storage');
        const tagsLS = localStorage.getItem('tags-storage');

        if (boardsLS && listsLS && cardsLS && tagsLS) {
            loadBoards(JSON.parse(boardsLS));
            loadLists(JSON.parse(listsLS));
            loadCards(JSON.parse(cardsLS));
            loadTags(JSON.parse(tagsLS));
            return
        }
            
        navigate('/');
    }, [userAuth]);

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