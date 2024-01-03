import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';  // Cambiado de useHistory
import { Link } from "react-router-dom"; // Componente para navegar entre rutas
import { mostrarAlerta } from "../functions.js";  // Importa una función mostrarAlerta desde un archivo functions.js

const LoginAdminComponent = () => {
    // Definición de la URL para las solicitudes
    const url = "http://localhost:8000/mascotas";

    // Hook de navegación
    const navigate = useNavigate();

    // Estado para almacenar los datos del formulario (nombre de usuario y contraseña)
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          // Enviar una solicitud POST al servidor con los datos del formulario
          const response = await axios.post(`${url}/login`, formData);
      
          if (response.data.success) {
            // Autenticación exitosa, redirigir a la página /crear
            navigate("/crear");
          } else {
            // Mostrar mensaje de error
            mostrarAlerta("Username o password incorrectas");
          }
        } catch (error) {
          // Manejar errores
          mostrarAlerta("Username o password incorrectas");
          if (error.response) {
            // El error tiene una respuesta del servidor
            console.log("Detalles de la respuesta del servidor:", error.response);
          }
        }
    };
      
  // Este componente representa la interfaz de usuario para la página de inicio de sesión de un administrador.
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

            {/* Contenedor principal */}
            <div className="containerr mt-5">
                {/* Fila centralizada */}
                <div className="row justify-content-center">
                    {/* Columna de ancho medio */}
                    <div className="col-md-6">
                        {/* Tarjeta que contiene el formulario */}
                        <div className="card">
                            {/* Encabezado de la tarjeta con título centrado */}
                            <div className="card-header">
                                <h2 className="text-center">Login</h2>
                            </div>

                            {/* Cuerpo de la tarjeta que contiene el formulario de inicio de sesión */}
                            <div className="card-body">
                                {/* Formulario */}
                                <form onSubmit={handleSubmit}>
                                    {/* Campo de entrada para el nombre de usuario */}
                                    <div className="form-group">
                                        <label htmlFor="username">Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <br />

                                    {/* Campo de entrada para la contraseña */}
                                    <div className="form-group">
                                        <label htmlFor="password">Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <br />

                                    {/* Botones para enviar el formulario y cancelar */}
                                    <button type="submit" className="btn btn-success">
                                        <i className="fa-solid fa-sign-in-alt"></i> Ingresar
                                    </button>
                                    {/* Enlace para cancelar y volver a la página principal */}
                                    <Link to={`/`} className="btn btn-danger ms-2">
                                        <i className="fas fa-times"></i> Cancelar
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default LoginAdminComponent;
