export interface ICumplimientoDocente {
    id?: string
    moduloId: number
    docenteId: string
    academicoAdministrativoId: number
    puntaje: number
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