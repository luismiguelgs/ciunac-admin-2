import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import logoCiunac from "@/assets/logo-ciunac-trans.png"
import logoUnac from "@/assets/unac-logo.png"
import ICalificacionUbicacion from "../../interfaces/calificacion.interface"
import { IDetalleExamenUbicacion } from "../../interfaces/examen-ubicacion.interface"
import { formatUbicacionFromCalificacion } from "../../examen-ubicacion.utils"

const RESULTS_PER_PAGE = 24

export interface ResultadoUbicacionGrupo {
    idioma: string
    detalles: IDetalleExamenUbicacion[]
}

interface ResultadosUbicacionFormatProps {
    periodo: string
    grupos: ResultadoUbicacionGrupo[]
    calificaciones: ICalificacionUbicacion[]
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 34,
        paddingBottom: 44,
        paddingHorizontal: 30,
        fontFamily: "Helvetica",
        fontSize: 9,
    },
    coverPage: {
        paddingTop: 42,
        paddingBottom: 44,
        paddingHorizontal: 34,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    coverHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
    },
    logoUnac: { width: 61, height: 82, objectFit: "contain" },
    logoCiunac: { width: 83, height: 83, objectFit: "contain" },
    coverLogoUnac: { width: 96, height: 126, objectFit: "contain" },
    coverLogoCiunac: { width: 126, height: 126, objectFit: "contain" },
    headerText: { flex: 1, alignItems: "center", textAlign: "center" },
    university: { fontSize: 16, fontWeight: 700, textAlign: "center" },
    coverUniversity: { fontSize: 14, fontWeight: 700, textAlign: "center" },
    subtitle: { fontSize: 12, marginTop: 4, textAlign: "center" },
    horizontalLine: {
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        borderBottomStyle: "solid",
        marginBottom: 10,
    },
    coverTitleBlock: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 70,
        marginBottom: 46,
    },
    coverTitle: {
        fontSize: 24,
        fontWeight: 700,
        textAlign: "center",
        lineHeight: 1.25,
    },
    coverPeriod: {
        fontSize: 16,
        fontWeight: 700,
        marginTop: 20,
        textAlign: "center",
    },
    languageBox: {
        marginTop: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: "#111",
        borderStyle: "solid",
    },
    languageTitle: { fontSize: 12, fontWeight: 700, marginBottom: 10, textAlign: "center" },
    languageItem: { fontSize: 11, textAlign: "center", marginBottom: 4 },
    coverNotice: {
        marginTop: 70,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        borderColor: "#111",
        borderStyle: "solid",
        backgroundColor: "#f2f2f2",
    },
    coverNoticeText: {
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1.35,
        textAlign: "justify",
    },
    pageTitle: { fontSize: 15, fontWeight: 700, textAlign: "center", marginTop: 6 },
    pageSubtitle: { fontSize: 11, fontWeight: 700, textAlign: "center", marginTop: 6, marginBottom: 12 },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        marginTop: 8,
        marginBottom: 6,
        padding: 5,
        backgroundColor: "#efefef",
        textAlign: "center",
    },
    table: { borderWidth: 1, borderColor: "#222", borderStyle: "solid", marginBottom: 10 },
    scaleTable: { borderWidth: 1, borderColor: "#222", borderStyle: "solid", marginBottom: 8 },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc", minHeight: 20 },
    rowLast: { flexDirection: "row", minHeight: 20 },
    scaleRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc", minHeight: 13 },
    scaleRowLast: { flexDirection: "row", minHeight: 13 },
    headerRow: { backgroundColor: "#e8e8e8", fontWeight: 700 },
    cell: { padding: 4, borderRightWidth: 1, borderRightColor: "#ccc", fontSize: 8.5 },
    cellLast: { padding: 4, fontSize: 8.5 },
    scaleCell: { padding: 2, borderRightWidth: 1, borderRightColor: "#ccc", fontSize: 8 },
    scaleCellLast: { padding: 2, fontSize: 7.2 },
    cellIndex: { width: "7%", textAlign: "center" },
    cellStudent: { width: "43%" },
    cellDoc: { width: "14.6%", textAlign: "center" },
    cellScore: { width: "9.7%", textAlign: "center" },
    cellResult: { width: "25.7%", textAlign: "center" },
    cellScoreNsp: { color: "#b91c1c", fontWeight: 700 },
    cellResultHighlight: { backgroundColor: "#dcfce7" },
    scaleLevel: { width: "36%" },
    scaleRange: { width: "22%", textAlign: "center" },
    scaleResult: { width: "42%", textAlign: "center" },
    empty: { fontSize: 10, color: "#555", marginTop: 8, textAlign: "center" },
    footer: {
        position: "absolute",
        bottom: 22,
        left: 30,
        right: 30,
        fontSize: 8,
        textAlign: "center",
        color: "#555",
    },
})

function normalizeLevel(value?: string) {
    return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
}

function getLevelOrder(value?: string) {
    const normalized = normalizeLevel(value)

    if (normalized.startsWith("BASICO")) return 1
    if (normalized.startsWith("INTERMEDIO")) return 2
    if (normalized.startsWith("AVANZADO")) return 3

    return 99
}

function getScaleLabel(calificacion: ICalificacionUbicacion) {
    return formatUbicacionFromCalificacion(calificacion)
}

function sortScale(a: ICalificacionUbicacion, b: ICalificacionUbicacion) {
    const nivelA = a.nivel?.nombre ?? a.ciclo?.nombre ?? ""
    const nivelB = b.nivel?.nombre ?? b.ciclo?.nombre ?? ""
    const nivelCompare = getLevelOrder(nivelA) - getLevelOrder(nivelB)

    if (nivelCompare !== 0) return nivelCompare

    return Number(a.notaMin) - Number(b.notaMin)
}

function getGroupIdiomaId(grupo: ResultadoUbicacionGrupo) {
    return grupo.detalles.find((detalle) => detalle.idiomaId)?.idiomaId
}

function getScaleByIdioma(grupo: ResultadoUbicacionGrupo, calificaciones: ICalificacionUbicacion[]) {
    const idiomaId = getGroupIdiomaId(grupo)

    return calificaciones
        .filter((calificacion) => {
            if (idiomaId) return calificacion.idiomaId === idiomaId || calificacion.ciclo?.idiomaId === idiomaId
            return calificacion.idioma?.nombre === grupo.idioma
        })
        .sort(sortScale)
}

function Header() {
    return (
        <View style={styles.header}>
            <Image src={logoUnac.src} style={styles.logoUnac} />
            <View style={styles.headerText}>
                <Text style={styles.university}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                <Text style={styles.subtitle}>CENTRO DE IDIOMAS</Text>
            </View>
            <Image src={logoCiunac.src} style={styles.logoCiunac} />
        </View>
    )
}

function CoverPage({ periodo, grupos }: { periodo: string; grupos: ResultadoUbicacionGrupo[] }) {
    return (
        <Page size="A4" style={styles.coverPage}>
            <View style={styles.coverHeader}>
                <Image src={logoUnac.src} style={styles.coverLogoUnac} />
                <View style={styles.headerText}>
                    <Text style={styles.coverUniversity}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                    <Text style={styles.subtitle}>CENTRO DE IDIOMAS</Text>
                </View>
                <Image src={logoCiunac.src} style={styles.coverLogoCiunac} />
            </View>
            <View style={styles.horizontalLine} />

            <View style={styles.coverTitleBlock}>
                <Text style={styles.coverTitle}>RESULTADOS DEL EXAMEN DE UBICACIÓN</Text>
                <Text style={styles.coverPeriod}>PERIODO {periodo}</Text>
            </View>

            <View style={styles.languageBox}>
                <Text style={styles.languageTitle}>IDIOMAS INCLUIDOS</Text>
                {grupos.length ? grupos.map((grupo) => (
                    <Text key={grupo.idioma} style={styles.languageItem}>{grupo.idioma.toUpperCase()}</Text>
                )) : (
                    <Text style={styles.languageItem}>SIN RESULTADOS DISPONIBLES</Text>
                )}
            </View>

            <View style={styles.coverNotice}>
                <Text style={styles.coverNoticeText}>
                    De acuerdo con el nivel ubicado, el estudiante deberá realizar el proceso de matrícula como alumno nuevo, consignando que rindió el examen de ubicación. Asimismo, en la sección de Observaciones de su matrícula, deberá registrarse que rindió dicho examen.
                </Text>
            </View>

            <Text style={styles.footer}>Centro de Idiomas - Universidad Nacional del Callao</Text>
        </Page>
    )
}

function ScaleTable({ scale }: { scale: ICalificacionUbicacion[] }) {
    return (
        <View style={styles.scaleTable} wrap={false}>
            <View style={[styles.scaleRow, styles.headerRow]}>
                <Text style={[styles.scaleCell, styles.scaleLevel]}>NIVEL</Text>
                <Text style={[styles.scaleCell, styles.scaleRange]}>PUNTAJE</Text>
                <Text style={[styles.scaleCellLast, styles.scaleResult]}>UBICACIÓN</Text>
            </View>
            {scale.length ? scale.map((calificacion, index) => {
                const rowStyle = index === scale.length - 1 ? styles.scaleRowLast : styles.scaleRow

                return (
                    <View key={calificacion.id ?? `${calificacion.cicloId}-${index}`} style={rowStyle}>
                        <Text style={[styles.scaleCell, styles.scaleLevel]}>{calificacion.nivel?.nombre ?? ""}</Text>
                        <Text style={[styles.scaleCell, styles.scaleRange]}>{calificacion.notaMin} - {calificacion.notaMax}</Text>
                        <Text style={[styles.scaleCellLast, styles.scaleResult]}>{getScaleLabel(calificacion)}</Text>
                    </View>
                )
            }) : (
                <View style={styles.scaleRowLast}>
                    <Text style={[styles.scaleCellLast, { width: "100%", textAlign: "center" }]}>No hay escala configurada para este idioma.</Text>
                </View>
            )}
        </View>
    )
}

function ResultsTable({
    detalles,
    startIndex,
    calificacionById,
}: {
    detalles: IDetalleExamenUbicacion[]
    startIndex: number
    calificacionById: Map<number | undefined, ICalificacionUbicacion>
}) {
    return (
        <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.cellIndex]}>N°</Text>
                <Text style={[styles.cell, styles.cellStudent]}>APELLIDOS Y NOMBRES</Text>
                <Text style={[styles.cell, styles.cellDoc]}>DNI</Text>
                <Text style={[styles.cell, styles.cellScore]}>NOTA</Text>
                <Text style={[styles.cellLast, styles.cellResult]}>UBICACIÓN</Text>
            </View>
            {detalles.length ? detalles.map((detalle, index) => {
                const rowStyle = index === detalles.length - 1 ? styles.rowLast : styles.row

                return (
                    <View key={detalle.id ?? index} style={rowStyle}>
                        <Text style={[styles.cell, styles.cellIndex]}>{startIndex + index + 1}</Text>
                        <Text style={[styles.cell, styles.cellStudent]}>
                            {`${detalle.estudiante?.apellidos ?? ""} ${detalle.estudiante?.nombres ?? ""}`.trim()}
                        </Text>
                        <Text style={[styles.cell, styles.cellDoc]}>{detalle.estudiante?.numeroDocumento ?? ""}</Text>
                        <Text style={[styles.cell, styles.cellScore, !detalle.nota ? styles.cellScoreNsp : {}]}>
                            {detalle.nota ? detalle.nota : "NSP"}
                        </Text>
                        <Text style={[styles.cellLast, styles.cellResult, styles.cellResultHighlight]}>
                            {formatUbicacionFromCalificacion(calificacionById.get(detalle.calificacionId))}
                        </Text>
                    </View>
                )
            }) : (
                <View style={styles.rowLast}>
                    <Text style={[styles.cellLast, { width: "100%", textAlign: "center" }]}>No hay resultados disponibles.</Text>
                </View>
            )}
        </View>
    )
}

function chunkDetails(detalles: IDetalleExamenUbicacion[]) {
    const chunks: IDetalleExamenUbicacion[][] = []

    for (let index = 0; index < detalles.length; index += RESULTS_PER_PAGE) {
        chunks.push(detalles.slice(index, index + RESULTS_PER_PAGE))
    }

    return chunks.length ? chunks : [[]]
}

export function ResultadosUbicacionFormat({
    periodo,
    grupos,
    calificaciones,
}: ResultadosUbicacionFormatProps) {
    const calificacionById = new Map(calificaciones.map((calificacion) => [calificacion.id, calificacion]))

    return (
        <Document>
            <CoverPage periodo={periodo} grupos={grupos} />

            {grupos.length ? grupos.map((grupo) => {
                const scale = getScaleByIdioma(grupo, calificaciones)
                const resultChunks = chunkDetails(grupo.detalles)

                return [
                    <Page key={`${grupo.idioma}-scale`} size="A4" style={styles.page}>
                        <Header />
                        <View style={styles.horizontalLine} />
                        <Text style={styles.pageTitle}>RESULTADOS DEL EXAMEN DE UBICACIÓN</Text>
                        <Text style={styles.pageSubtitle}>{grupo.idioma.toUpperCase()} - PERIODO {periodo}</Text>

                        <Text style={styles.sectionTitle}>ESCALA DE NIVELES</Text>
                        <ScaleTable scale={scale} />

                        <Text style={styles.footer}>Centro de Idiomas - Universidad Nacional del Callao</Text>
                    </Page>,
                    ...resultChunks.map((chunk, pageIndex) => (
                        <Page key={`${grupo.idioma}-results-${pageIndex}`} size="A4" style={styles.page}>
                            <Header />
                            <View style={styles.horizontalLine} />
                            <Text style={styles.pageTitle}>RESULTADOS DEL EXAMEN DE UBICACIÓN</Text>
                            <Text style={styles.pageSubtitle}>
                                {grupo.idioma.toUpperCase()} - PERIODO {periodo}{pageIndex > 0 ? " - CONTINUACIÓN" : ""}
                            </Text>

                            <Text style={styles.sectionTitle}>RESULTADOS</Text>
                            <ResultsTable
                                detalles={chunk}
                                startIndex={pageIndex * RESULTS_PER_PAGE}
                                calificacionById={calificacionById}
                            />

                            <Text style={styles.footer}>Centro de Idiomas - Universidad Nacional del Callao</Text>
                        </Page>
                    )),
                ]
            }) : (
                <Page size="A4" style={styles.page}>
                    <Header />
                    <View style={styles.horizontalLine} />
                    <Text style={styles.empty}>No hay resultados disponibles para el periodo seleccionado.</Text>
                    <Text style={styles.footer}>Centro de Idiomas - Universidad Nacional del Callao</Text>
                </Page>
            )}
        </Document>
    )
}
