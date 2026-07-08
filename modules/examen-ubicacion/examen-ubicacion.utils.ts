import { IEstado } from "@/modules/estructura/interfaces/types.interface"
import { IExamenUbicacion } from "./interfaces/examen-ubicacion.interface"
import ICalificacionUbicacion from "./interfaces/calificacion.interface"

export const EXAMEN_ESTADO_REFERENCIA = "EXAMEN_UBICACION"
export const EXAMEN_ACTA_GENERADA_ID = 13

export type ExamenEstadoKey = "PROGRAMADO" | "ASIGNADO" | "TERMINADO" | "ACTA_GENERADA"

export const SOLICITUD_ESTADOS = {
    NUEVA: 1,
    PAGADA: 4,
    ASIGNADA: 12,
    TERMINADA: 3,
} as const

export function normalizeEstadoNombre(nombre?: string | null) {
    return String(nombre ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s-]+/g, "_")
        .toUpperCase()
}

export function getEstadosExamen(estados: IEstado[]) {
    return estados.filter((estado) => estado.referencia === EXAMEN_ESTADO_REFERENCIA)
}

export function findEstadoExamenByKey(estados: IEstado[], key: ExamenEstadoKey) {
    return getEstadosExamen(estados).find((estado) => normalizeEstadoNombre(estado.nombre) === key)
}

export function getEstadoExamenLabel(estadoId?: number, nombre?: string, estados: IEstado[] = []) {
    if (nombre) return nombre
    const estado = getEstadosExamen(estados).find((item) => item.id === estadoId)
    return estado?.nombre ?? "Desconocido"
}

export function isEstadoExamen(key: ExamenEstadoKey, estadoId?: number, nombre?: string, estados: IEstado[] = []) {
    if (normalizeEstadoNombre(nombre) === key) return true
    const estado = getEstadosExamen(estados).find((item) => item.id === estadoId)
    if (normalizeEstadoNombre(estado?.nombre) === key) return true

    return key === "ACTA_GENERADA" && estadoId === EXAMEN_ACTA_GENERADA_ID
}

export function getActaExamenId(examen?: IExamenUbicacion | null) {
    return examen?.actaId ?? examen?.acta?.id ?? null
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
