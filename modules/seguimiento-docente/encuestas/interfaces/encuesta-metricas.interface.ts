export interface IEncuestaMetricas {
    id?: number,
    docenteId: string,
    moduloId: number,
    promedioGeneral: number,
    totalEncuestados: number,
    totalCursos: number,
    fechaRegistro: string,
    docente: {
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
    modulo: {
        id: number,
        nombre: string,
        fechaInicio: string,
        fechaFin: string,
        orden: number,
        activo: boolean
    }
}