//IMPORT
import React, { useEffect, useState } from "react";  // Importa React y algunos hooks como useEffect y useState
import axios from "axios";  // Importa axios para hacer solicitudes HTTP
import { mostrarAlerta } from "../functions.js";  // Importa una función mostrarAlerta desde un archivo functions.js
import Swal from 'sweetalert2';  // Importa la librería SweetAlert2 para mostrar alertas en un estilo atractivo
import withReactContent from "sweetalert2-react-content";  // Importa withReactContent para integrar SweetAlert2 con React
import ReactPaginate from "react-paginate";  // Importa ReactPaginate para implementar la paginación en React
import './styles.css';  // Importa un archivo de estilos CSS
import 'bootstrap/dist/css/bootstrap.min.css';  // Importa el estilo CSS de Bootstrap
import { Link } from "react-router-dom"; // Componente para navegar entre rutas

// CUERPO DEL COMPONENTE MascotasComponent
const MascotasComponent = () => {
  // Definición de constantes y estados locales
  const url = "http://localhost:8000/mascotas";  // URL base para las solicitudes al servidor
  const [mascotas, setMascotas] = useState([]);  // Estado para almacenar la lista de mascotas
  const [id, setId] = useState("");  // Estado para el id de la mascota
  const [nombre, setNombre] = useState("");  // Estado para el nombre de la mascota
  const [edad, setEdad] = useState("");  // Estado para la edad de la mascota
  const [raza, setRaza] = useState("");  // Estado para la raza de la mascota
  const [imagen, setImagen] = useState("");  // Estado para la URL de la imagen de la mascota
  const [descripcion1, setDescripcion1] = useState("");  // Estado para la primera descripción de la mascota
  const [descripcion2, setDescripcion2] = useState("");  // Estado para la segunda descripción de la mascota
  const [operacion, setOperacion] = useState("");  // Estado para la operación (puede necesitar más contexto para entender su propósito)
  const [titulo, setTitulo] = useState("");  // Estado para el título (puede necesitar más contexto para entender su propósito)

  const [pageNumber, setPageNumber] = useState(0);  // Estado para el número de página actual en la paginación
  const mascotasPerPage = 3;  // Número de mascotas por página

  const [busqueda, setBusqueda] = useState("");

  // Efecto de montaje: se ejecuta una vez al cargar el componente
  useEffect(() => {
    getMascotas();  // Llama a la función getMascotas al cargar el componente
  }, []);

  // Esta función asincrónica utiliza axios para realizar una solicitud GET al servidor y obtener la lista de mascotas.
  // Utiliza el término de búsqueda proporcionado en el estado 'busqueda' para filtrar los resultados.
  const getMascotas = async () => {
    try {
        // Realizar la solicitud GET al servidor con el término de búsqueda
        const respuesta = await axios.get(`${url}/buscar?termino=${busqueda}`);

        // Actualizar el estado 'mascotas' con los datos recibidos del servidor
        setMascotas(respuesta.data);
    } catch (error) {
        // Manejar errores en caso de que la solicitud no sea exitosa
        console.error("Error al obtener las mascotas:", error);
    }
  };


  // Función para abrir el modal de mascotas
  const openModal = (opcion, id, nombre, edad, raza, imagen, descripcion1, descripcion2) => {
    // Reinicia los estados locales para evitar información residual del modal anterior
    setId('');
    setNombre('');
    setEdad('');
    setRaza('');
    setImagen('');
    setDescripcion1('');
    setDescripcion2('');

    // Configura el estado de operación según la opción proporcionada (1 para registrar, 2 para editar)
    setOperacion(opcion);

    // Configura el título del modal según la opción
    if (opcion === 1) {
      setTitulo("Registrar Mascota");
    } else if (opcion === 2) {
      setTitulo("Editar Mascota");

      // Configura los estados con los datos de la mascota seleccionada para editar
      setId(id);
      setNombre(nombre);
      setEdad(edad);
      setRaza(raza);
      setImagen(imagen);
      setDescripcion1(descripcion1);
      setDescripcion2(descripcion2);
    }
  };


  // Función para validar y enviar la solicitud de creación o actualización de una mascota
  const validar = () => {
    let parametros;
    let metodo;

    // Validación: Verifica que el campo de nombre no esté vacío
    if (nombre.trim() === '') {
      console.log("Debe escribir un Nombre");
      mostrarAlerta("Debe escribir un Nombre");
    }
    // Validación: Verifica que el campo de edad no esté vacío
    else if (String(edad).trim() === '') {
      console.log("Debe escribir una Edad");
      mostrarAlerta("Debe escribir una Edad");
    }
    // Si pasa la validación, procede con la creación o actualización de la mascota
    else {
      // Configura los parámetros según la operación (1 para crear, 2 para actualizar)
      if (operacion === 1) {
        parametros = {
          urlExt: `${url}/crear`,
          nombre: nombre.trim(),
          edad: edad.trim(),
          raza: raza.trim(),
          imagen: imagen.trim(),
          descripcion1: descripcion1.trim(),
          descripcion2: descripcion2.trim()
        };
        metodo = "POST";
      } else {
        parametros = {
          urlExt: `${url}/actualizar/${id}`,
          nombre: nombre.trim(),
          edad: edad.trim(),
          raza: raza.trim(),
          imagen: imagen.trim(),
          descripcion1: descripcion1.trim(),
          descripcion2: descripcion2.trim()
        };
        metodo = "PUT";
      }

      // Llama a la función enviarSolicitud para realizar la operación correspondiente (POST o PUT)
      enviarSolicitud(metodo, parametros);
    }
  };



  // Función para enviar solicitudes HTTP (POST o PUT)
  const enviarSolicitud = async (metodo, parametros) => {
    try {
      // Realiza la solicitud HTTP usando axios
      const respuesta = await axios({
        method: metodo,  // Método de la solicitud (POST o PUT)
        url: parametros.urlExt,  // URL de la solicitud
        data: parametros  // Datos a enviar en la solicitud
      });

      // Extrae el tipo y el mensaje de la respuesta recibida
      const tipo = respuesta.data.tipo;
      const mensaje = respuesta.data.mensaje;

      // Muestra una alerta con el mensaje y tipo de la respuesta
      mostrarAlerta(mensaje, tipo);

      // Si la respuesta es exitosa (tipo "success"), cierra el modal y actualiza la lista de mascotas
      if (tipo === "success") {
        document.getElementById("btnCerrarModal").click();  // Simula hacer clic en el botón de cerrar modal
        getMascotas();  // Actualiza la lista de mascotas
      }
    } catch (error) {
      // Muestra una alerta en caso de error en la solicitud
      mostrarAlerta(`Error en la solicitud`, error);
    }
  };

  
  // Función para mostrar un cuadro de diálogo de confirmación y eliminar una mascota
  const eliminarMascota = (id, nombre) => {
    // Crea una instancia de SweetAlert2 con soporte para React
    const MySwal = withReactContent(Swal);

    // Muestra un cuadro de diálogo de confirmación
    MySwal.fire({
      title: `¿Estás seguro de eliminar la mascota ${nombre}?`,
      icon: 'question',
      text: 'Se eliminará definitivamente',
      showCancelButton: true, 
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        // Configura el estado del id y envía una solicitud DELETE para eliminar la mascota
        setId(id);
        enviarSolicitud("DELETE", { urlExt: `${url}/eliminar/${id}`, id: id });
      } else {
        // Muestra una alerta informativa si el usuario cancela la eliminación
        mostrarAlerta("No se eliminó la mascota", "info");
      }
    });
  };


  // Función para manejar el cambio de página en la paginación
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);  // Actualiza el estado del número de página al seleccionado
  };

  // Calcula el número total de páginas requeridas para la paginación
  const pageCount = Math.ceil(mascotas.length / mascotasPerPage);

  // Calcula el índice de inicio de las mascotas en la página actual
  const offset = pageNumber * mascotasPerPage;


  // Renderiza la interfaz de usuario del componente
  return (
    <div className="App">

      {/* Sección para mostrar el logo o imagen de la página */}
      <div class="d-flex align-items-center justify-content-between">
            <img src="/logo.png" alt="Logo o imagen de la página" style={{ width: '145px', height: '145px' }} />

            <form class="d-flex" role="search" style={{ flex: '1' }}>
                <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Buscar por nombre o raza"
                    aria-label="Search"
                    style={{ width: '100%' }}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button class="btn btn-success" type="button" onClick={getMascotas}>
                    Buscar
                </button>
            </form>

            <Link to={`/`} className="btn btn-danger ms-2">
              <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
            </Link>
        </div>

      <div className="container-fluid">
        {/* Sección para agregar una nueva mascota */}
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
                onClick={() => openModal(1)}
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalMascotas"
              >
                <i className="fa-solid fa-circle-plus"></i>Añadir
              </button>
            </div>
          </div>
        </div>

        {/* Sección para mostrar la lista de mascotas y paginación */}
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="row">
              {/* Mapea y muestra cada mascota */}
              {mascotas.slice(offset, offset + mascotasPerPage).map((mascota) => (
                <div key={mascota.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card" style={{ width: '18rem' }}>
                    {/* Muestra la imagen de la mascota */}
                    <img src={mascota.imagen} className="card-img-top" alt="" style={{ objectFit: 'cover', height: '250px' }}/>
                    <div className="card-body">
                      {/* Muestra información de la mascota */}
                      <h5 className="card-title">{mascota.nombre}</h5>
                      <p className="card-text">
                        <strong>Edad:</strong> {mascota.edad}
                        <br />
                        <strong>Raza:</strong> {mascota.raza}
                        <br />
                        {mascota.descripcion1}
                      </p>
                      {/* Botones para editar y eliminar la mascota */}
                      <button
                        onClick={() => openModal(2, mascota.id, mascota.nombre, mascota.edad, mascota.raza, mascota.imagen, mascota.descripcion1, mascota.descripcion2)}
                        className="btn btn-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#modalMascotas"
                      >
                        <i className="fa-solid fa-edit"></i> Editar
                      </button>
                      {' '}
                      <button
                        onClick={() => eliminarMascota(mascota.id, mascota.nombre)}
                        className="btn btn-danger"
                      >
                        <i className="fa-solid fa-trash"></i> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sección de paginación */}
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

        {/* Modal para agregar o editar mascotas */}
        <div id="modalMascotas" className="modal fade" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                {/* Muestra el título del modal (Registrar o Editar Mascota) */}
                <label className="h5">{titulo}</label>
              </div>

              <div className="modal-body">
                {/* Campos de entrada para la información de la mascota */}
                <input type="hidden" id="id"></input>
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
                    onChange={(e)=>setNombre(e.target.value)}
                  ></input>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-clock"></i>
                  </span>
                  <input
                    type="text"
                    id="edad"
                    className="form-control"
                    placeholder="Edad"
                    value={edad}
                    onChange={(e)=>setEdad(e.target.value)}

                  ></input>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">
                      <i className="fa-solid fa-dog"></i>
                  </span>
                  <input
                      type="text"
                      id="raza"
                      className="form-control"
                      placeholder="Raza"
                      value={raza}
                      onChange={(e) => setRaza(e.target.value)}
                  ></input>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">
                      <i className="fa-solid fa-camera"></i>
                  </span>
                  <input
                      type="text"
                      id="imagen"
                      className="form-control"
                      placeholder="Link de la Imagen"
                      value={imagen}
                      onChange={(e) => setImagen(e.target.value)}
                  ></input>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">
                      <i className="fa-solid fa-comment"></i>
                  </span>
                  <input
                      type="text"
                      id="descripcion1"
                      className="form-control"
                      placeholder="Descripcion Corta"
                      value={descripcion1}
                      onChange={(e) => setDescripcion1(e.target.value)}
                  ></input>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">
                      <i className="fa-solid fa-info-circle"></i>
                  </span>
                  <input
                      type="text"
                      id="descripcion2"
                      className="form-control"
                      placeholder="Descripcion Larga"
                      value={descripcion2}
                      onChange={(e) => setDescripcion2(e.target.value)}
                  ></input>
                </div>

                {/* Botón para guardar la mascota */}
                <div className="d-grid col-6 mx-auto">
                  <button onClick={() => validar()} className="btn btn-success">
                    <i className="fa-solid fa-floppy-disk"></i>Guardar
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                {/* Botón para cerrar el modal */}
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
    </div>
  );

};

//EXPORT
//Exportar el componente
export default MascotasComponent;
