import { IBaseData } from "./types.interface";

export default interface ICiclo extends IBaseData{
    nombre:string,
    numeroCiclo: number,
    idiomaId: number,
    nivelId: number,
    idioma?: {
        id: number,
        nombre: string
    },
    nivel?: {
        id: number,
        nombre: string,
        orden: number,
    }
}
    