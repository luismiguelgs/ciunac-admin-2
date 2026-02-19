export interface IEncuestaRespuesta {
    id?: number,
    docenteId: string,
    periodo: string,
    grupo: string,
    estudiante: string,
    promedioIndividual: string,
    comentario: string,
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
    }
}