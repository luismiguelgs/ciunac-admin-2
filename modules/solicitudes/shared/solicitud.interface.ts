export interface IEstudianteSolicitud {
    id?: string
    nombres: string
    apellidos: string
    genero?: string
    fechaNacimiento?: string
    tipoDocumento: string
    numeroDocumento: string
    celular: string
    email?: string | null
    imgDoc?: string | null
    facultadId?: number | null
    escuelaId?: number | null
    codigo?: string | null
    direccion?: string | null
    creadoEn?: string
    modificadoEn?: string
}

export interface CreateSolicitudPayload {
    estudianteId: string
    tipoSolicitudId: number
    idiomaId: number
    nivelId: number
    estadoId: number
    periodo: string
    alumnoCiunac: boolean
    fechaPago: string
    pago: number
    numeroVoucher: string
    imgVoucher?: string | null
    imgCertEstudio?: string | null
    observaciones?: string
    digital: boolean
    manual: boolean
}

export interface ISolicitud {
    id: number,
    estudianteId: string,
    tipoSolicitudId: number,
    idiomaId: number,
    nivelId: number,
    estadoId: number,
    periodo: string,
    alumnoCiunac: boolean,
    fechaPago: string,
    pago: number,
    numeroVoucher: string,
    imgVoucher: string | null,
    imgCertEstudio: string | null,
    observaciones?: string,
    digital: boolean,
    manual: boolean,
    creadoEn: string,
    modificadoEn: string,
    estudiante?: IEstudianteSolicitud,
    tiposSolicitud?: {
        id: number,
        solicitud: string,
        precio: number
    },
    idioma?: {
        id: number,
        nombre: string
    },
    nivel?: {
        id: number,
        nombre: string,
        orden: number
    },
    estado?: {
        id: number,
        nombre: string,
        referencia: string
    }
}
