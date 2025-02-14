import { Route, Routes } from "react-router-dom"
import { Sidebar } from "../sidebar"
import { Tableros } from "./tableros"
import { Tablero } from "../tablero/tablero"

export const KanbaX = () => {
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