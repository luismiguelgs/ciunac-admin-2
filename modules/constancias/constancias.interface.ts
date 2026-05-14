export interface IConstancia {
    _id?: string;
    id?: string;
    tipo: 'MATRICULA' | 'NOTAS';
    estudiante: string;
    dni: string;
    idioma: string;
    idiomaId?: number;
    nivel: string;
    nivelId?: number;
    ciclo: number;
    impreso: boolean;
    id_solicitud: number;
    horario?: string;
    url?: string;
    driveId?: string;
    modalidad?: 'REGULAR' | 'INTENSIVO';
    aceptado: boolean;
    creado_en?: Date;
    modificado_en?: Date;
    detalle?: IConstanciaDetalle[];
}

export interface IConstanciaDetalle {
    id?: string;
    idioma: string;
    nivel: string;
    ciclo: string;
    modalidad: 'REGULAR' | 'INTENSIVO',
    mes: string;
    año: string;
    aprobado: boolean;
    nota: number;
    isNew?: boolean;
}