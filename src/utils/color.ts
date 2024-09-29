export const getTextColorForBackground = (backgroundColor: string) => {
  // Convierte color hexadecimal a RGB
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calcular el brillo del color usando la fórmula estándar
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Si el brillo es mayor a 128, el color es claro, usa color negro, si es menor usa blanco
  return brightness > 128 ? "#000000" : "#FFFFFF";
};
