export interface IActaExamenUbicacion {
    id?: string
    _id?: string
    schemaVersion?: number
    examenId: number
    codigo: string
    fecha: string | Date
    creado_en?: string | Date
    modificado_en?: string | Date
    estadoExamen?: string
    salon?: string
    docente?: string
    idioma?: string
    aula?: {
        id: number
        nombre: string
        tipo?: string
        ubicacion?: string
    }
    docenteDetalle?: {
        id: string
        nombres: string
        apellidos: string
    }
    idiomaDetalle?: {
        id: number
        nombre: string
    }
    generadoPor?: {
        usuarioId?: string
        email?: string
        rol?: string
    }
    participantes: IParticipanteActaExamenUbicacion[]
}

export interface IParticipanteActaExamenUbicacion {
    detalleId: number
    estudianteId: string
    solicitudId: number
    numeroVoucher?: string
    tipoDocumento?: string
    dni: string
    apellidos: string
    nombres: string
    nivelId?: number
    nivel?: string
    calificacionId?: number
    cicloId?: number
    ciclo?: string
    cicloCodigo?: string
    nota?: number
    ubicacion?: string
    terminado?: boolean
}
