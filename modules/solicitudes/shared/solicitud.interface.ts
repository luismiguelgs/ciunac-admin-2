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
    imgVoucher: string,
    imgCertEstudio: string,
    digital: boolean,
    manual: boolean,
    creadoEn: string,
    modificadoEn: string,
    estudiante?: {
        id: string,
        nombres: string,
        apellidos: string,
        genero: string,
        fechaNacimiento: string,
        tipoDocumento: string,
        numeroDocumento: string,
        celular: string,
        imgDoc: string | null,
        facultadId: number,
        escuelaId: number,
        codigo: string,
        direccion: string | null,
        creadoEn: string,
        modificadoEn: string
    },
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