import '../../App.css';
import { Route, Routes } from "react-router-dom"
// import { Sidebar } from "../boards/sidebar";
import { Tableros } from "../boards/boards";
import { Tablero } from "../boards/board";

export const KanbaX = () => {    
  return (
    <div className='App'>
      {/* <Sidebar /> */}
      <Routes>
        <Route path='/' element={<Tableros />} />
        <Route path='/:currentIdBoard/*' element={<Tablero />} />
      </Routes>
    </div>
  )
}