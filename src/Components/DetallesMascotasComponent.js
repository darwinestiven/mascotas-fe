// IMPORTACIONES
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Hook para obtener parámetros de la URL
import axios from "axios"; // Librería para realizar solicitudes HTTP
import { Link } from "react-router-dom"; // Componente para navegar entre rutas
import './styles.css'; // Estilos del componente

// CUERPO DEL COMPONENTE
const VerMascotasComponent = () => {
  // Obtiene el parámetro de la URL usando el hook useParams de React Router
  const { id } = useParams();

  const url = "http://localhost:8000/mascotas";
  const [mascotas, setMascotas] = useState([null]); // Estado para almacenar la información de la mascota

  // Efecto de montaje: se ejecuta al cargar el componente o cuando el parámetro id cambia
  useEffect(() => {
    getMascotaById(id); // Llama a la función para obtener la información de la mascota por su ID
  }, [id]);

  // Función asincrónica para obtener la información de la mascota por su ID
  const getMascotaById = async (id) => {
    try {
      const respuesta = await axios.get(`${url}/buscar/${id}`);
      console.log(respuesta.data);
      setMascotas(respuesta.data); // Actualiza el estado con la información de la mascota
    } catch (error) {
      console.error("Error al obtener la mascota:", error);
    }
  };

  // RENDERIZACIÓN DEL COMPONENTE
  return (
    <div className="App">
      <br />
      {/* Sección para mostrar el logo o imagen de la página */}
      <div>
        <img
          src="/logo.png"
          alt="Logo o imagen de la página"
          style={{ width: "150px", height: "150px" }}
        />
      </div>
      <br />

      {/* Verifica si hay información de mascotas antes de renderizar */}
      {mascotas && (
        <div className="container">
          <br />
          {/* Sección para mostrar los detalles de la mascota */}
          <div>
            <h2>{mascotas.nombre} ({mascotas.raza})</h2>
            <p style={{ textAlign: 'justify' }}>{mascotas.descripcion2}</p>
          </div>

          {/* Botón para regresar a la página principal */}
          <div className="d-flex justify-content-between mt-3">
            <Link to={`/`} className="btn btn-dark ms-auto">
              <i className="fas fa-reply"></i> Regresar
            </Link>
          </div>
          <br />
        </div>
      )}
    </div>
  );
};

// EXPORTACIÓN DEL COMPONENTE
export default VerMascotasComponent;
