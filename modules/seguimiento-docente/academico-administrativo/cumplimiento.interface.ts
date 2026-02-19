export interface ICumplimientoDocente {
    id?: number
    moduloId: number
    docenteId: string
    academicoAdministrativoId: number
    puntaje: number
    isNew?: boolean
    modulo?: {
        id: number
        nombre: string
    }
    academicoAdministrativo?: {
        id: number
        nombre: string
        peso: number
    }
    docente?: {
        id: string
        nombres: string
        apellidos: string
    }
}