import { Route, Router, Routes } from 'react-router-dom';
import './App.css'
import { Start } from './componentes/rutas/start'
import { FormLogin } from './componentes/rutas/formLogin';
import { KanbaX } from './componentes/rutas/kanbaX';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<FormLogin />} />
      <Route path="/kanbaX/*" element={<KanbaX />} />
    </Routes>
  )
}

export default App
