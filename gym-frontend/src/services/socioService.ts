import { type Socio } from '../models/Socio';

//Datos de ejemplo para simular la respuesta del back
const sociosMock: Socio[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    tipo_doc: 'DNI',
    nro_doc: '12345678',
    email: 'juan@example.com',
    telefono: '1234567890',
    fechaNacimiento: '1990-01-01',
    fechaRegistro: '2024-01-15',
    estado: 'activo',
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'García',
    tipo_doc: 'DNI',
    nro_doc: '87654321',
    email: 'maria@example.com',
    telefono: '0987654321',
    fechaNacimiento: '1992-05-15',
    fechaRegistro: '2024-02-20',
    estado: 'activo',
  },
];

export const socioService = {
  getAllSocios: async (): Promise<Socio[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(sociosMock), 500); // simula delay
    });
  },
};
