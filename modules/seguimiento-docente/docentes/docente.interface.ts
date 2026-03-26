export interface IDocente {
    id: string;
    usuario_id: string;
    nombres: string;
    apellidos: string;
    genero: string;
    celular: string;
    fechaNacimiento: string;
    numeroDocumento: string;
    tipoDocumento: string;
    activo: boolean;
    visible?: boolean;
    creadoEn: Date;
    modificadoEn: Date;
    perfil: {
        id: string;
        docenteId: string;
        experienciaTotal: number;
        idiomaId: number;
        nivelIdioma: string;
        puntajeFinal: number;
        visible?: boolean;
        creadoEn: Date;
        modificadoEn: Date;
    }
}