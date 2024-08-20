export type Perfil = {
  id: number;
  username: string;
  fullName: string;
  firstName: string;
  secondName: string | null;
  lastName: string;
  secondLastName: string | null;
  email: string;
  rol: {
    id: number;
    nombre: string;
    codigo: 'ENF' | 'DOC' | 'ADMIN';
  };
  isDoctor: boolean;
  isEnfermera: boolean;
  isAdmin: boolean;
};
