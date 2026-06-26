import { IDocente } from "@/modules/seguimiento-docente/docentes/docente.interface"

export interface IExamenUbicacion {
    id?: number
    codigo: string
    fecha: string | Date
    estadoId: number
    idiomaId: number
    docenteId: string
    aulaId: number
    creadoEn?: string | Date
    modificadoEn?: string | Date
    estado?: {
        id: number
        nombre: string
        referencia?: string
    }
    idioma?: {
        id: number
        nombre: string
    }
    docente?: Pick<IDocente, "id" | "nombres" | "apellidos">
    aula?: {
        id: number
        nombre: string
        tipo?: string
        ubicacion?: string
    }
}

export interface IDetalleExamenUbicacion {
    id?: number
    examenId: number
    solicitudId: number
    idiomaId: number
    nivelId: number
    estudianteId: string
    nota: number
    calificacionId: number
    terminado: boolean
    activo?: boolean
    creadoEn?: string | Date
    modificadoEn?: string | Date
    estudiante?: {
        id: string
        nombres: string
        apellidos: string
        numeroDocumento: string
    }
    idioma?: {
        id: number
        nombre: string
    }
    nivel?: {
        id: number
        nombre: string
    }
    calificacion?: {
        id: number
        ciclo?: {
            id: number
            nombre: string
            numeroCiclo?: number
        }
    }
}
