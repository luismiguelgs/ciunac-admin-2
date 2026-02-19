export interface IPerfilResultado {
    id?: number,
    perfilDocenteId: string,
    moduloId: number,
    docenteId: string,
    resultadoFinal: string,
    creadoEn: string,
    modificadoEn: string,
    perfilDocente?: {
        id: string,
        docenteId: string,
        experienciaTotal: number,
        idiomaId: number,
        nivelIdioma: string,
        puntajeFinal: number,
        creadoEn: string,
        modificadoEn: string
    },
    modulo?: {
        id: number,
        nombre: string,
        fechaInicio: string,
        fechaFin: string,
        orden: number,
        activo: boolean,
        visible: boolean
    },
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
    }
}