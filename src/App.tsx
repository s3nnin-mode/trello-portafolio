import './App.css'

import { Sidebar } from './componentes/sidebar';
import { Tablero } from './componentes/tablero/tablero';
import { Routes, Route, useParams } from 'react-router-dom';
import { Tableros } from './componentes/rutas/tableros';

function App() {

  return (
    <div className='App'>
      <Sidebar />
      <Routes>
        {/* <Route path='/tablero' element={<Tablero />} /> */}
        <Route path='/' element={<Tableros />} />
        <Route path='/:currentIdBoard' element={<Tablero />}/>
      </Routes>
    </div>
  )
}

export default App
