export default interface ICronogramaUbicacion {
    id?: number
    moduloId: number
    fecha: string | Date
    activo: boolean
    creadoEn?: string | Date
    modificadoEn?: string | Date
    modulo?: {
        id: number
        nombre: string
    }
    isNew?: boolean
}
