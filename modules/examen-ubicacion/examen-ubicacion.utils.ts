import ICalificacionUbicacion from "./interfaces/calificacion.interface"

export const EXAMEN_ESTADOS = {
    PROGRAMADO: 6,
    ASIGNADO: 7,
    TERMINADO: 8,
} as const

export const SOLICITUD_ESTADOS = {
    NUEVA: 1,
    ASIGNADA: 12,
    TERMINADA: 3,
} as const

export function getEstadoExamenLabel(estadoId?: number, nombre?: string) {
    if (nombre) return nombre
    if (estadoId === EXAMEN_ESTADOS.PROGRAMADO) return "Programado"
    if (estadoId === EXAMEN_ESTADOS.ASIGNADO) return "Asignado"
    if (estadoId === EXAMEN_ESTADOS.TERMINADO) return "Terminado"
    return "Desconocido"
}

export function obtenerResultadoUbicacion(
    nota: number,
    idiomaId: number,
    nivelId: number,
    calificaciones: ICalificacionUbicacion[]
) {
    const matches = calificaciones.filter((calificacion) =>
        calificacion.idiomaId === idiomaId &&
        calificacion.nivelId === nivelId &&
        Number(nota) >= Number(calificacion.notaMin) &&
        Number(nota) <= Number(calificacion.notaMax)
    )

    if (matches.length > 1) {
        console.warn("Rangos de calificacion de ubicacion duplicados o solapados", {
            nota,
            idiomaId,
            nivelId,
            calificacionIds: matches.map((calificacion) => calificacion.id),
        })
        return null
    }

    return matches[0]?.id ?? null
}

export function formatUbicacionFromCalificacion(calificacion?: ICalificacionUbicacion | null) {
    if (!calificacion) return "Calificacion no encontrada"

    return calificacion.ciclo?.nombre?.trim() || "Sin ubicacion configurada"
}

export function buildCodigoExamen(periodo: string, idiomaId: number | string, aulaId: number | string) {
    return `${periodo}-${idiomaId}-${aulaId}`
}

export function toDateInputValue(value?: string | Date) {
    if (!value) return ""
    const date = new Date(value)
    if (isNaN(date.getTime())) return ""
    return date.toISOString().split("T")[0]
}
