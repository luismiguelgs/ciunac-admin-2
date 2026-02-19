export interface IPregunta {
    id?: number;
    orden: number;
    textoPregunta: string;
    dimension: string;
    activo: boolean;
    isNew?: boolean;
}