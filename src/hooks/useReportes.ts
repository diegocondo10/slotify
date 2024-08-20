import { useState } from 'react';

const useReportes = ({ reportes }: { reportes: Record<string, any> }) => {
  const imprimir = (promise: Promise<any>) => {};

  return { imprimir };
};

export default useReportes;
