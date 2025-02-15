import { Route, Routes } from 'react-router-dom';
import './App.css'
import { Start } from './components/rutas/start';
import { FormLogin } from './components/rutas/formLogin';
import { KanbaX } from './components/rutas/kanbaX';

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
