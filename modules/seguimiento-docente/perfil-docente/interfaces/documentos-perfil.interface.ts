export default interface IDocumentosPerfil {
	id?: number,
	perfilDocenteId: string,
	tipoDocumentoPerfilId: number,
	estadoId: number,
	descripcion: string,
	institucionEmisora: string,
	urlArchivo: string,
	fechaEmision: string,
	horasCapacitacion: number,
	puntaje: number,
	experienciaLaboral: number,
	creadoEn: string,
	modificadoEn: string,
	perfilDocente?: {
		id: string,
		docenteId: string,
		experienciaTotal: number,
		idiomaId: number,
		nivelIdioma: string,
		puntajeFinal: number,
		creadoEn: string,
		modificadoEn: string
	},
	tipoDocumentoPerfil?: {
		id: number,
		nombre: string,
		puntaje: number
	},
	estado?: {
		id: number,
		nombre: string,
		referencia: string
	}
}