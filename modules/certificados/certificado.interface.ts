export type CertificadoTipo = "FISICO" | "VIRTUAL" | "DIGITAL"
export type CertificadoModalidad = "C.R." | "C.I." | "EX.U." | ""

export interface ICertificadoNota {
    id?: string
    ciclo: string
    periodo: string
    modalidad: CertificadoModalidad
    nota: number
    isNew?: boolean
}

export interface ICertificado {
    _id?: string
    id?: string
    tipo: CertificadoTipo
    periodo: string
    estudiante: string
    numeroDocumento: string
    idioma: string
    idiomaId?: number
    nivel: string
    nivelId?: number
    cantidadHoras: number
    solicitudId: number
    fechaEmision: string | Date
    numeroRegistro: string
    fechaConcluido: string | Date
    curriculaAnterior?: boolean
    impreso?: boolean
    duplicado?: boolean
    certificadoOriginal?: string
    url?: string | null
    driveId?: string | null
    aceptado?: boolean
    fechaAceptacion?: string | Date | null
    elaboradoPor?: string
    creadoEn?: string | Date
    modificadoEn?: string | Date
    notas: ICertificadoNota[]
}

export type CertificadoPayload = Omit<ICertificado, "id" | "_id" | "creadoEn" | "modificadoEn">
