import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Swal from 'sweetalert2';

import Layout from '../../components/Layout';

const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;

const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput!) {
    actualizarCliente(id: $id, input: $input) {
      nombre
      apellido
    }
  }
`;

const EditarCliente = () => {
  //Obtener id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //Consultar para obtener cliente
  const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id,
    },
  });

  //Actualizar el cliente
  const [actializarCliente] = useMutation(ACTUALIZAR_CLIENTE);

  console.log(data);
  console.log(loading);
  console.log(error);

  //Schema de validacion
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required('El nombre del cliente es obligatorio'),
    apellido: Yup.string().required('El apellido del cliente es obligatorio'),
    empresa: Yup.string().required('El nombre de la empresa es obligatorio'),
    email: Yup.string()
      .email('El email no es valido')
      .required('El email es obligatorio'),
  });

  if (loading) return 'Cargando...';

  const { obtenerCliente } = data;

  //Modifica el cliente ne la base de datos
  const actializarInfoCliente = async (valores) => {
    const { nombre, apellido, empresa, email, telefono } = valores;

    try {
      const { data } = await actializarCliente({
        variables: {
          id,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
          },
        },
      });

      //Mostrar alerta
      Swal.fire(
        'Actualizado',
        'El cliente se actializo correctamente',
        'success'
      );

      //Redireccionar
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit={(valores) => {
              actializarInfoCliente(valores);
            }}
          >
            {(props) => {
              return (
                <form
                  className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                  onSubmit={props.handleSubmit}
                >
                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='nombre'
                    >
                      Nombre
                    </label>
                    <input
                      id='nombre'
                      type='text'
                      placeholder='Nombre Cliente'
                      value={props.values.nombre}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>

                  {props.touched.nombre && props.errors.nombre ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Errror: </p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='apellido'
                    >
                      Apellido
                    </label>
                    <input
                      id='apellido'
                      type='text'
                      placeholder='Apellido Cliente'
                      value={props.values.apellido}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>

                  {props.touched.apellido && props.errors.apellido ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Errror: </p>
                      <p>{props.errors.apellido}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='empresa'
                    >
                      Empresa
                    </label>
                    <input
                      id='empresa'
                      type='text'
                      placeholder='Empresa Cliente'
                      value={props.values.empresa}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>

                  {props.touched.empresa && props.errors.empresa ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Errror: </p>
                      <p>{props.errors.empresa}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='email'
                    >
                      Email
                    </label>
                    <input
                      id='email'
                      type='email'
                      placeholder='Email Cliente'
                      value={props.values.email}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>

                  {props.touched.email && props.errors.email ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Errror: </p>
                      <p>{props.errors.email}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='telefono'
                    >
                      Telefono
                    </label>
                    <input
                      id='telefono'
                      type='tel'
                      placeholder='Telefono Cliente'
                      value={props.values.telefono}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                  </div>

                  <input
                    type='submit'
                    className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                    value='Editar cliente'
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarCliente;
