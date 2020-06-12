import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
            email
        }
    }
`;


const Header = () => {

    //Query de apollo
    const { data, loading, error } = useQuery(OBTENER_USUARIO);
    // console.log(data);
    // console.log(loading);
    // console.log(error);

    const router = useRouter(); 


    //Proteger que no accedamos a data antes de tener resultados
    if(loading) return null;

    //Si no hay informacion
    if(!data.obtenerUsuario) {
        return router.push('/login');
    }

    const { nombre, apellido, email } = data.obtenerUsuario;

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex justify-between mb-3">
            <p className="mr-2 font-bold uppercase text-xs">Hola: {nombre} {apellido} <span className="text-gray-800 font-light">({email})</span></p>
            <button 
                onClick={ ()=> cerrarSesion() }
                type="button" 
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md">
                Cerrar Sesion
            </button>
        </div>
    );
}

export default Header;