// Importaciones necesarias para el enrutamiento
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importaciones de componentes creados
import MascotasComponent from './Components/MascotasComponent.js';
import VerMascotasComponent from './Components/VerMascotasComponent.js';
import DetallesMascotasComponent from './Components/DetallesMascotasComponent.js';
import LoginAdminComponent from './Components/LoginAdminComponent.js';

// Estilos de la aplicación
import './App.css';

// Función principal que define la estructura de las rutas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para mostrar la lista de mascotas */}
        <Route path='/' element={<VerMascotasComponent></VerMascotasComponent>}></Route>
        
        {/* Ruta para crear o editar mascotas */}
        <Route path='/crear' element={<MascotasComponent></MascotasComponent>}></Route>
        
        {/* Ruta para ver detalles de una mascota específica */}
        <Route path='/detalles/:id' element={<DetallesMascotasComponent></DetallesMascotasComponent>}></Route>

        {/* Ruta para ir al login */}
        <Route path='/login' element={<LoginAdminComponent></LoginAdminComponent>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

// Exporta la función principal para ser utilizada en otros archivos
export default App;
