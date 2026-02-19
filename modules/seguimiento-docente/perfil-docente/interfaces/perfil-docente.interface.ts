export interface PerfilDocente {
    id?: string,
    docenteId: string,
    experienciaTotal: number,
    idiomaId: number,
    nivelIdioma?: string | null,
    puntajeFinal: number,
    creadoEn?: string,
    modificadoEn?: string,
    visible: boolean
    docente?: {
        id: string,
        nombres: string,
        apellidos: string,
        genero: string,
        celular: string,
        fechaNacimiento: string,
        numeroDocumento: string,
        tipoDocumento: string,
        activo: boolean,
        creadoEn: string,
        modificadoEn: string
    },
    idioma?: {
        id: number,
        nombre: string
    }
}
