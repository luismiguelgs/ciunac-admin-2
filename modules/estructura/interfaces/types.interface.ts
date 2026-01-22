export interface ITexto{
    id?:string,
    codigo:string,
    contenido:string,
    creadoEn?:Date,
    modificadoEn?:Date
}
export interface IBaseData{
    id?: number,
    isNew?:boolean
}
export interface IIdioma extends IBaseData{
    nombre:string
}
export interface IFacultad extends IBaseData{
    nombre:string,
    codigo: string
}
export interface ITipoSolicitud extends IBaseData{ 
    solicitud:string, 
    precio:number
}
export interface ISalon extends IBaseData{
    capacidad: number,
    tipo: string,
    nombre: string,
    ubicacion: string
}
export interface IEscuela extends IBaseData{
    nombre: string,
    facultadId: number
}
export interface IModulo extends IBaseData{
    nombre: string,
    fechaInicio: Date,
    fechaFin: Date,
    orden: number
}

export interface INivel extends IBaseData{
    nombre: string,
    orden: number
}


  