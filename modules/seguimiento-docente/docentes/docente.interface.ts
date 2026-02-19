export interface IDocente {
    id: string;
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
}