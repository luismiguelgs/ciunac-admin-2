"use client"

import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import logoCiunac from "@/assets/logo-ciunac-trans.png"
import logoUnac from "@/assets/unac-logo.png"
import firmaDirector from "@/assets/firma_director.jpg"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { ITexto } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import ICalificacionUbicacion from "../../interfaces/calificacion.interface"
import { IDetalleExamenUbicacion } from "../../interfaces/examen-ubicacion.interface"
import { formatUbicacionFromCalificacion } from "../../examen-ubicacion.utils"

const YEAR_TEXT_FALLBACK = "Año de la recuperación y consolidación de la economía peruana"

const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 30,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    logoUnac: { width: 90, height: 120, objectFit: "contain" },
    logoCiunac: { width: 120, height: 120, objectFit: "contain" },
    headerText: {
        flex: 1,
        alignItems: "center",
        textAlign: "center",
    },
    university: {
        fontSize: 18,
        fontWeight: 700,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        marginTop: 5,
        textAlign: "center",
    },
    horizontalLine: {
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        borderBottomStyle: "solid",
        marginBottom: 10,
    },
    yearText: {
        fontSize: 12,
        textAlign: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 700,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 1.5,
        textAlign: "justify",
    },
    signatureContainer: {
        alignItems: "center",
        marginTop: 50,
        marginBottom: 80,
    },
    signatureImage: {
        width: 200,
        height: 80,
        objectFit: "contain",
    },
    signatureText: {
        fontSize: 12,
        marginTop: 10,
    },
})

export function ConstanciaFormat({
    data,
    calificacion,
}: {
    data?: IDetalleExamenUbicacion
    calificacion?: ICalificacionUbicacion
}) {
    const { data: textos } = useOpciones<ITexto>(Collection.Textos)
    const estudiante = `${data?.estudiante?.nombres ?? ""} ${data?.estudiante?.apellidos ?? ""}`.trim() || "_________________________"
    const dni = data?.estudiante?.numeroDocumento || "_____________"
    const idioma = data?.idioma?.nombre || "_____________"
    const puntaje = data?.nota ? `${data.nota}/100` : "______"
    const ubicacion = formatUbicacionFromCalificacion(calificacion)
    const nombreAnio = textos.find((texto) => texto.codigo === "TEXTO_NOMBREAN")?.contenido?.trim() || YEAR_TEXT_FALLBACK

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src={logoUnac.src} style={styles.logoUnac} />
                    <View style={styles.headerText}>
                        <Text style={styles.university}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                        <Text style={styles.subtitle}>VICERRECTORADO ACADÉMICO</Text>
                        <Text style={styles.subtitle}>CENTRO DE IDIOMAS</Text>
                    </View>
                    <Image src={logoCiunac.src} style={styles.logoCiunac} />
                </View>
                <View style={styles.horizontalLine} />
                <Text style={styles.yearText}>&quot;{nombreAnio}&quot;</Text>

                <Text style={styles.title}>CONSTANCIA DE EXAMEN DE UBICACIÓN</Text>

                <Text style={styles.paragraph}>
                    El director del Centro de Idiomas de la Universidad Nacional del Callao, hace constar:
                    {"\n\n"}
                    Que, {estudiante.toLocaleUpperCase()}, identificado con DNI {dni}, participó del examen de ubicación del idioma {idioma}, obteniendo un puntaje de {puntaje}, con lo cual se le ubica en el nivel {ubicacion}.
                    {"\n\n"}
                    Se expide el presente, a solicitud de la parte interesada para los fines pertinentes.
                </Text>

                <View style={styles.signatureContainer}>
                    <Image src={firmaDirector.src} style={styles.signatureImage} />
                    <Text style={styles.signatureText}>Firma del Director</Text>
                </View>

                <View style={styles.horizontalLine} />
            </Page>
        </Document>
    )
}
