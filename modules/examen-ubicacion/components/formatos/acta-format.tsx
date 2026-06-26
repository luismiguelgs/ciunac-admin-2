"use client"

import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import logoCiunac from "@/assets/logo-ciunac.jpg"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { ITexto } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import { IDetalleExamenUbicacion, IExamenUbicacion } from "../../interfaces/examen-ubicacion.interface"

const YEAR_TEXT_FALLBACK = "Año de la recuperación y consolidación de la economía peruana"

const styles = StyleSheet.create({
    page: { padding: 32, fontSize: 10, fontFamily: "Helvetica" },
    headerContainer: { alignItems: "center", marginBottom: 18, minHeight: 112, paddingTop: 14, position: "relative" },
    logo: { position: "absolute", left: 0, top: -45, width: 150, height: 150, objectFit: "contain" },
    university: { fontSize: 11, fontWeight: 700, textAlign: "center", marginTop: 15 },
    department: { fontSize: 10, fontWeight: 700, textAlign: "center", marginTop: 2 },
    yearText: { fontSize: 9, textAlign: "center", marginTop: 6 },
    title: { fontSize: 16, fontWeight: 700, textAlign: "center", marginTop: 12 },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", paddingVertical: 5 },
    header: { backgroundColor: "#eee", fontWeight: 700 },
    cellDoc: { width: "18%" },
    cellName: { width: "54%" },
    cellLevel: { width: "16%" },
    cellScore: { width: "12%", textAlign: "center" },
    meta: { marginBottom: 12, gap: 3 , marginTop: -20},
    signatures: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
    signature: { width: "40%", borderTopWidth: 1, borderTopColor: "#111", paddingTop: 6, textAlign: "center" },
})

export function ActaFormat({
    examen,
    detalle,
}: {
    examen: IExamenUbicacion
    detalle: IDetalleExamenUbicacion[]
}) {
    const { data: textos } = useOpciones<ITexto>(Collection.Textos)
    const fecha = examen.fecha ? new Date(examen.fecha).toLocaleDateString("es-PE") : ""
    const docente = `${examen.docente?.nombres ?? ""} ${examen.docente?.apellidos ?? ""}`.trim()
    const idioma = String(examen.idioma?.nombre ?? examen.idiomaId).toUpperCase()
    const nombreAnio = textos.find((texto) => texto.codigo === "TEXTO_NOMBREAN")?.contenido?.trim() || YEAR_TEXT_FALLBACK

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <Image src={logoCiunac.src} style={styles.logo} />
                    <Text style={styles.university}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                    <Text style={styles.department}>DIRECCIÓN DEL CENTRO DE IDIOMAS</Text>
                    <Text style={styles.yearText}>&quot;{nombreAnio}&quot;</Text>
                    <Text style={styles.title}>EXAMEN DE UBICACIÓN - {idioma}</Text>
                </View>
                <View style={styles.meta}>
                    <Text>Codigo: {examen.codigo}</Text>
                    <Text>Fecha: {fecha}</Text>
                    <Text>Idioma: {examen.idioma?.nombre ?? examen.idiomaId}</Text>
                    <Text>Docente: {docente || examen.docenteId}</Text>
                    <Text>Aula: {examen.aula?.nombre ?? examen.aulaId}</Text>
                </View>

                <View style={[styles.row, styles.header]}>
                    <Text style={styles.cellDoc}>Documento</Text>
                    <Text style={styles.cellName}>Estudiante</Text>
                    <Text style={styles.cellLevel}>Nivel</Text>
                    <Text style={styles.cellScore}>Nota</Text>
                </View>
                {detalle.map((item) => (
                    <View key={item.id} style={styles.row}>
                        <Text style={styles.cellDoc}>{item.estudiante?.numeroDocumento ?? ""}</Text>
                        <Text style={styles.cellName}>{item.estudiante?.apellidos} {item.estudiante?.nombres}</Text>
                        <Text style={styles.cellLevel}>{item.nivel?.nombre ?? item.nivelId}</Text>
                        <Text style={styles.cellScore}>{item.nota ? item.nota : ""}</Text>
                    </View>
                ))}

                <View style={styles.signatures}>
                    <Text style={styles.signature}>Docente Evaluador</Text>
                    <Text style={styles.signature}>Coordinacion Academica</Text>
                </View>
            </Page>
        </Document>
    )
}
