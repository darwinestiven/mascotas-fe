// IMPORTACIONES
import React, { useEffect, useState } from "react";
import axios from "axios"; // Librería para realizar solicitudes HTTP
import { Link } from "react-router-dom"; // Componente para navegar entre rutas
import { mostrarAlerta } from "../functions.js"; // Función personalizada para mostrar alertas
import ReactPaginate from "react-paginate"; // Componente para implementar la paginación
import './styles.css'; // Estilos del componente

// CUERPO DEL COMPONENTE
const VerMascotasComponent = () => {

  const url = "http://localhost:8000/mascotas";
  // Estados para almacenar la información de las mascotas y datos de adopción
  const [mascotas, setMascotas] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [titulo, setTitulo] = useState("");

  // Estados y funciones para la paginación
  const [pageNumber, setPageNumber] = useState(0);
  const mascotasPerPage = 3;

  // Efecto de montaje: se ejecuta al cargar el componente
  useEffect(() => {
    getMascotas(); // Llama a la función para obtener la información de las mascotas
  }, []);

  // Función asincrónica para obtener la información de las mascotas
  const getMascotas = async () => {
    try {
      const respuesta = await axios.get(`${url}/buscar`);
      setMascotas(respuesta.data); // Actualiza el estado con la información de las mascotas
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
    }
  };

  // Función para manejar el cambio de página en la paginación
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  // Calcula el número total de páginas requeridas para la paginación
  const pageCount = Math.ceil(mascotas.length / mascotasPerPage);
  const offset = pageNumber * mascotasPerPage; // Calcula el índice de inicio de las mascotas en la página actual

  // Función para abrir el modal de adopción con los datos de una mascota específica
  const openModal = (mascotaId) => {
    setTitulo("Datos Adopción Mascota");
    setId(mascotaId);
    setNombre('');
    setTelefono('');
  };

  // Función para validar y enviar la solicitud de adopción
  const validar = () => {
    let parametros;
    let metodo;
    // Validación: Verifica que el campo de nombre no esté vacío
    if (nombre.trim() === '') {
      mostrarAlerta("Debe escribir un Nombre");
    }
    // Validación: Verifica que el campo de teléfono no esté vacío
    else if (String(telefono).trim() === '') {
      mostrarAlerta("Debe escribir un teléfono");
    } else {
      // Configura los parámetros para la solicitud de adopción (POST)
      parametros = {
        urlExt: `${url}/adopcion/crear`,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        id_mascota: id,
      };
      metodo = "POST";
      // Envía la solicitud de adopción
      enviarSolicitud(metodo, parametros);
    }
  };

  // Función para enviar la solicitud de adopción al servidor
  const enviarSolicitud = async (metodo, parametros) => {
    try {
      const respuesta = await axios({ method: metodo, url: parametros.urlExt, data: parametros });
      // Extrae el tipo y el mensaje de la respuesta
      let tipo = respuesta.data.tipo;
      let mensaje = respuesta.data.mensaje;
      // Muestra una alerta con el mensaje y tipo de la respuesta
      mostrarAlerta(mensaje, tipo);
      // Si la respuesta es exitosa (tipo "success"), cierra el modal y actualiza la lista de mascotas
      if (tipo === "success") {
        document.getElementById("btnCerrarModal").click();
        getMascotas();
      }
    } catch (error) {
      // Muestra una alerta en caso de error en la solicitud
      mostrarAlerta(`Error en la solicitud`, error);
    }
  };


  return (
    <div className="App">
      <br/>
      {/* Sección para mostrar el logo o imagen de la página */}
      <div>
        <img
          src="/logo.png"
          alt="Logo o imagen de la página"
          style={{ width: '145px', height: '145px' }}
        />
      </div>
  
      {/* Contenedor principal */}
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="row">
              {/* Mapea y muestra las mascotas en tarjetas */}
              {mascotas.slice(offset, offset + mascotasPerPage).map((mascota) => (
                <div key={mascota.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card" style={{ width: '18rem' }}>
                    {/* Muestra la imagen de la mascota */}
                    <img
                      src={mascota.imagen}
                      className="card-img-top"
                      alt=""
                      style={{ objectFit: 'cover', height: '220px' }}
                    />
                    <div className="card-body">
                      {/* Muestra información básica de la mascota */}
                      <h5 className="card-title">{mascota.nombre}</h5>
                      <p className="card-text">
                        <strong>Edad:</strong> {mascota.edad}
                        <br />
                        <strong>Raza:</strong> {mascota.raza}
                        <br />
                        {mascota.descripcion1}
                      </p>
  
                      {/* Enlace para ver detalles de la mascota */}
                      <Link to={`/detalles/${mascota.id}`} className="btn btn-primary">
                        <i className="fas fa-info-circle"></i> Detalles
                      </Link>
                      {' '}
                      {/* Botón para abrir el modal de adopción */}
                      <button
                        onClick={() => openModal(mascota.id)}
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#modalAdopcion"
                      >
                        <i className="fas fa-paw"></i> Adoptar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Paginación */}
            <div className="row mt-3">
              <div className="col-12 text-center">
                <ReactPaginate
                  previousLabel={"Anterior"}
                  nextLabel={"Siguiente"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  containerClassName={"custom-pagination"}
                  pageClassName={"custom-pagination-item"}
                  activeClassName={"custom-pagination-item--selected"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Modal de adopción */}
      <div id="modalAdopcion" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">Datos Para Adoptar Mascota</label>
            </div>
  
            <div className="modal-body">
              {/* Campos para ingresar datos de adopción */}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-dog"></i>
                </span>
                <input
                  type="text"
                  id="id_mascota"
                  className="form-control"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  readOnly
                ></input>
              </div>
  
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-user"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                ></input>
              </div>
  
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-phone"></i>
                </span>
                <input
                  type="number"
                  id="telefono"
                  className="form-control"
                  placeholder="Telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                ></input>
              </div>
  
              {/* Botón para enviar datos de adopción */}
              <div className="d-grid col-6 mx-auto">
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i> Enviar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="btnCerrarModal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
};

//EXPORT
//Exportar el componente
export default VerMascotasComponent;
