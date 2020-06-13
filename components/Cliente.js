import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

const Cliente = ({ cliente }) => {
  //Elinar cliente
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache) {
      //Obtener una copia del objeto de cahce
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO,
      });

      //Reescribir el cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(
            (clienteActual) => clienteActual.id !== id
          ),
        },
      });
    },
  });

  const { nombre, apellido, empresa, email, id } = cliente;

  //Elimina un cliente
  const confirmarEliminarCliente = () => {
    Swal.fire({
      title: 'Deseas eliminar a este cliente?',
      text: 'Esta accion no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cancelar',
    }).then(async (result) => {
      if (result.value) {
        //Eliminar por id
        console.log('Eliminando!', id);
        const { data } = await eliminarCliente({
          variables: {
            id,
          },
        });

        console.log(data);

        //Mostrar una alerta
        try {
          Swal.fire('Eliminado', data.eliminarCliente, 'success');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarCliente = () => {
    Router.push({
      pathname: '/editarcliente/[id]',
      query: { id },
    });
  };

  return (
    <tr>
      <td className='border px-4 py-2'>
        {nombre} {apellido}
      </td>
      <td className='border px-4 py-2'>{empresa}</td>
      <td className='border px-4 py-2'>{email}</td>
      <td className='border px-4 py-2'>
        <button
          type='button'
          className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
          onClick={() => confirmarEliminarCliente()}
        >
          Eliminar
          <svg
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='w-4 h-4 ml-2'
          >
            <path d='M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6'></path>
          </svg>
        </button>
      </td>
      <td>
        <button
          type='button'
          className='flex justify-center items-center bg-green-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
          onClick={() => editarCliente()}
        >
          Editar
          <svg
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='w-4 h-4 ml-2'
          >
            <path d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'></path>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Cliente;
