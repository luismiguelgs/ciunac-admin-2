import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function obtenerPeriodo() {
  const fechaActual = new Date();
  const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1 para obtener el mes actual
  const año = fechaActual.getFullYear();

  // Formatear los valores para que tengan dos dígitos si es necesario
  const mesFormateado = String(mes).padStart(2, '0');

  return `${String(año)}${mesFormateado}`
}

export function formatDate(date: string | Date | undefined) {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

