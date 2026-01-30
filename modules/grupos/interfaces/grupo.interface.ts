export interface IGrupo {
    id?: number;
    moduloId: number;
    cicloId: number;
    codigo: string;
    docenteId: string;
    aulaId?: number;
    frecuencia: string;
    modalidad: string;
    creadoEn?: Date;
    modificadoEn?: Date;
    ciclo?: {
        id: number;
        nombre: string;
        codigo: string;
    };
    modulo?: {
        id: number;
        nombre: string;
    };
    docente?: {
        id: string;
        nombres: string;
        apellidos: string;
    };
}