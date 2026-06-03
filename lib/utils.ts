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

export function formatDateTime(date: string | Date | undefined) {
  if (!date) return "N/A"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "N/A"
  return d.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function getGoogleDriveDirectLink(url: string | null | undefined) {
  if (!url) return "";
  
  // Pattern for: https://drive.google.com/file/d/FILE_ID/view...
  const driveFileRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveFileRegex);
  
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  
  // Pattern for: https://drive.google.com/open?id=FILE_ID
  const driveOpenRegex = /id=([a-zA-Z0-9_-]+)/;
  if (url.includes("drive.google.com/open")) {
    const openMatch = url.match(driveOpenRegex);
    if (openMatch && openMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
    }
  }

  return url;
}
