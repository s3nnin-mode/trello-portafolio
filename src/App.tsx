import { Route, Routes } from 'react-router-dom';
import './App.css'
import { Start } from './components/rutas/start';
import { FormRegister } from './components/rutas/formRegister';
import { KanbaX } from './components/rutas/kanbaX';
import { FormLogin } from './components/rutas/formLogin';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path='/login' element={<FormLogin />} />
      <Route path="/register" element={<FormRegister />} />
      <Route path="/kanbaX/*" element={<KanbaX />} />
    </Routes>
  )
}

export default App
