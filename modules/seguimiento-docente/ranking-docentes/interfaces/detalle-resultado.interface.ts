export interface DetalleResultado {
	modulo: string
	docenteId: string
	promediosGrupos: PromedioGrupo[]
	cumplimiento: Cumplimiento[]
	encuestaMetricas: EncuestaMetricas
}

interface PromedioGrupo {
	grupo: string
	promedio: string
}

export interface Cumplimiento {
	cumplimientoId: number
	rubroId: number
	rubro: string
	puntaje: number
	peso: number
	puntajePonderado: string
}

interface EncuestaMetricas {
	id: number
	docenteId: string
	moduloId: number
	promedioGeneral: string
	totalEncuestados: number
	totalCursos: number
	fechaRegistro: string
}
