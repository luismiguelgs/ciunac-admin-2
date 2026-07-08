import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import logoCiunac from "@/assets/logo-ciunac.jpg"
import { IActaExamenUbicacion } from "../../interfaces/acta-examen-ubicacion.interface"

const styles = StyleSheet.create({
    page: {
        padding: 32,
        fontFamily: "Helvetica",
        fontSize: 9,
    },
    header: {
        minHeight: 104,
        alignItems: "center",
        marginBottom: 12,
        paddingTop: 10,
        position: "relative",
    },
    logo: {
        position: "absolute",
        left: 0,
        top: -32,
        width: 128,
        height: 128,
        objectFit: "contain",
    },
    university: {
        fontSize: 12,
        fontWeight: 700,
        textAlign: "center",
    },
    department: {
        fontSize: 11,
        fontWeight: 700,
        textAlign: "center",
        marginTop: 3,
    },
    title: {
        fontSize: 15,
        fontWeight: 700,
        textAlign: "center",
        marginTop: 14,
    },
    meta: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
        marginBottom: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    metaItem: {
        width: "48%",
        marginBottom: 3,
    },
    table: {
        borderWidth: 1,
        borderColor: "#222",
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        minHeight: 22,
    },
    rowLast: {
        flexDirection: "row",
        minHeight: 22,
    },
    headerRow: {
        backgroundColor: "#efefef",
        fontWeight: 700,
    },
    cell: {
        padding: 4,
        borderRightWidth: 1,
        borderRightColor: "#ccc",
    },
    cellLast: {
        padding: 4,
    },
    cellIndex: { width: "4.9%", textAlign: "center" },
    cellDoc: { width: "14%", textAlign: "center" },
    cellStudent: { width: "35%" },
    cellLevel: { width: "14%", textAlign: "center" },
    cellLocation: { width: "25.7%", textAlign: "center" },
    cellScore: { width: "6.4%", textAlign: "center" },
    empty: {
        padding: 10,
        textAlign: "center",
        color: "#555",
    },
    signatures: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 64,
    },
    signature: {
        width: "40%",
        borderTopWidth: 1,
        borderTopColor: "#111",
        paddingTop: 6,
        textAlign: "center",
    },
})

function formatDate(value?: string | Date) {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toLocaleDateString("es-PE")
}

export function ActaNotasFormat({ acta }: { acta: IActaExamenUbicacion }) {
    const participantes = acta.participantes ?? []
    const idioma = String(acta.idioma ?? acta.idiomaDetalle?.nombre ?? "").toUpperCase()
    const docente = acta.docente || `${acta.docenteDetalle?.nombres ?? ""} ${acta.docenteDetalle?.apellidos ?? ""}`.trim()
    const aula = acta.salon || acta.aula?.nombre || ""
    const fecha = formatDate(acta.fecha)

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src={logoCiunac.src} style={styles.logo} />
                    <Text style={styles.university}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                    <Text style={styles.department}>DIRECCIÓN DEL CENTRO DE IDIOMAS</Text>
                    <Text style={styles.title}>ACTA DE NOTAS - EXAMEN DE UBICACIÓN{idioma ? ` - ${idioma}` : ""}</Text>
                </View>

                <View style={styles.meta}>
                    <Text style={styles.metaItem}>Código: {acta.codigo ?? ""}</Text>
                    <Text style={styles.metaItem}>Fecha: {fecha}</Text>
                    <Text style={styles.metaItem}>Docente: {docente}</Text>
                    <Text style={styles.metaItem}>Aula: {aula}</Text>
                </View>

                <View style={styles.table}>
                    <View style={[styles.row, styles.headerRow]}>
                        <Text style={[styles.cell, styles.cellIndex]}>N°</Text>
                        <Text style={[styles.cell, styles.cellDoc]}>Documento</Text>
                        <Text style={[styles.cell, styles.cellStudent]}>Estudiante</Text>
                        <Text style={[styles.cell, styles.cellLevel]}>Nivel</Text>
                        <Text style={[styles.cell, styles.cellLocation]}>Ubicación</Text>
                        <Text style={[styles.cellLast, styles.cellScore]}>Nota</Text>
                    </View>
                    {participantes.length ? participantes.map((participante, index) => {
                        const rowStyle = index === participantes.length - 1 ? styles.rowLast : styles.row

                        return (
                            <View key={participante.detalleId ?? participante.estudianteId ?? index} style={rowStyle}>
                                <Text style={[styles.cell, styles.cellIndex]}>{index + 1}</Text>
                                <Text style={[styles.cell, styles.cellDoc]}>
                                    {[participante.tipoDocumento, participante.dni].filter(Boolean).join(" ")}
                                </Text>
                                <Text style={[styles.cell, styles.cellStudent]}>
                                    {`${participante.apellidos ?? ""} ${participante.nombres ?? ""}`.trim()}
                                </Text>
                                <Text style={[styles.cell, styles.cellLevel]}>{participante.nivel ?? ""}</Text>
                                <Text style={[styles.cell, styles.cellLocation]}>{participante.ubicacion || participante.ciclo || ""}</Text>
                                <Text style={[styles.cellLast, styles.cellScore]}>{participante.nota ?? ""}</Text>
                            </View>
                        )
                    }) : (
                        <Text style={styles.empty}>No hay detalle de notas disponible.</Text>
                    )}
                </View>

                <View style={styles.signatures}>
                    <Text style={styles.signature}>Docente Evaluador</Text>
                    <Text style={styles.signature}>Dirección del Centro de Idiomas</Text>
                </View>
            </Page>
        </Document>
    )
}
