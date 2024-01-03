// Importaciones necesarias para el enrutamiento
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importaciones de componentes creados
import MascotasComponent from './Components/MascotasComponent.js';
import VerMascotasComponent from './Components/VerMascotasComponent.js';
import DetallesMascotasComponent from './Components/DetallesMascotasComponent.js';

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
      </Routes>
    </BrowserRouter>
  );
}

// Exporta la función principal para ser utilizada en otros archivos
export default App;
