interface IOpciones {
    id?: number;
    nombre: string;
}

export interface ITipoDocumentosPerfil extends IOpciones {
    puntaje: number;
}

export interface IAreasSeguimiento extends IOpciones {
    peso: number;
}

export interface IPuntajesAcademicoAdmin extends IOpciones {
    academicoAdministrativoId: number;
    puntaje: number;
    academicoAdministrativo: IAreasSeguimiento;
}