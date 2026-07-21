import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import coordinadora from "@/assets/coordinadora.jpg"
import elaborador from "@/assets/elaboradoring.jpg"
import director from "@/assets/firma.jpg"
import type { ICertificado, ICertificadoNota } from "../certificado.interface"
import { capitalizeCertificateName, normalizeCertificadoNota } from "../certificados.utils"
import { CertificateBodyView } from "./body-view"

Font.register({ family: "Dancing Script", src: "/fonts/DancingScript-VariableFont_wght.ttf" })
Font.register({ family: "PinyonScript", src: "/fonts/PinyonScript-Regular.ttf" })
Font.register({ family: "Roboto-Bold", src: "/fonts/Roboto-Bold.ttf" })

const imageSource = (image: { src: string } | string) => typeof image === "string" ? image : image.src

const styles = StyleSheet.create({
    page: { paddingTop: 45, paddingBottom: 45 },
    script: { fontSize: 18, fontFamily: "Dancing Script", lineHeight: 1.5 },
    student: { fontSize: 24, fontFamily: "PinyonScript", textAlign: "center", marginHorizontal: "auto" },
    strong: { fontSize: 18, fontFamily: "Roboto-Bold", marginHorizontal: 6 },
    signature: { width: 140 },
    table: { width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf" },
    row: { flexDirection: "row" },
    headerCol: { borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf", padding: 3 },
    col: { borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf", padding: 3 },
    headerText: { fontSize: 26, fontFamily: "Roboto-Bold", margin: "auto", marginTop: 5 },
    cellText: { fontFamily: "Roboto-Bold", margin: "auto", marginTop: 5, paddingVertical: 5, fontSize: 13 },
    duplicate: { borderWidth: 2, borderColor: "black", padding: 5, margin: 10, textAlign: "center", width: "auto", alignSelf: "center" },
    duplicateText: { fontFamily: "Roboto-Bold", fontSize: 20, textAlign: "center", alignSelf: "center", textTransform: "uppercase" },
})

function formatLongDate(value: string | Date): string {
    const date = new Date(value)
    return date.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Lima" })
}

function getRows(notas: ICertificadoNota[]): ICertificadoNota[] {
    const rows = notas.toSorted((a, b) => {
        const left = Number(a.ciclo.match(/\d+$/)?.[0] || 0)
        const right = Number(b.ciclo.match(/\d+$/)?.[0] || 0)
        return left - right
    }).map(item => ({ ...item, nota: normalizeCertificadoNota(item.nota) }))
    while (rows.length < 9) rows.push({ ciclo: "", periodo: "", modalidad: "", nota: 0 })
    return rows
}

export function CertificadoFisicoFormat({ certificado, qrCode }: { certificado: ICertificado; qrCode: string }) {
    const rows = getRows(certificado.notas || [])
    const issueDate = formatLongDate(certificado.fechaEmision)
    const conclusionDate = formatLongDate(certificado.fechaConcluido)

    return (
        <Document title={`Certificado ${certificado.numeroRegistro}`} author="Centro de Idiomas - UNAC">
            <Page size="A4" style={[styles.page, { paddingHorizontal: 75 }]}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 2, marginTop: 10 }}>
                    <Text style={{ fontSize: 20, fontFamily: "Dancing Script", marginTop: 120 }}>El director del Centro de Idiomas</Text>
                    <Image style={{ width: 120, marginTop: 70 }} src={qrCode} />
                </View>
                <Text style={{ fontSize: 70, textAlign: "center", fontFamily: "PinyonScript", marginTop: 40, marginBottom: 40 }}>Certifica</Text>
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 2 }}>
                    <Text style={styles.script}>Que</Text>
                    <View style={{ flexGrow: 1, borderBottomWidth: 1, borderBottomColor: "black", borderBottomStyle: "solid", marginHorizontal: 5 }}>
                        <Text style={styles.student}>{capitalizeCertificateName(certificado.estudiante)}</Text>
                    </View>
                </View>
                {certificado.curriculaAnterior ? (
                    <Text style={[styles.script, { textAlign: "justify" }]} hyphenationCallback={word => [word]}>
                        ha concluido satisfactoriamente el <Text style={styles.strong}>{` NIVEL ${certificado.nivel} `}</Text>
                        de la currícula antigua del idioma <Text style={styles.strong}>{certificado.idioma}</Text>, en nuestra Casa Superior de Estudios con un total de <Text style={styles.strong}>240</Text> horas. Se le expide el presente, a solicitud de la parte interesada para los fines pertinentes.
                    </Text>
                ) : (
                    <CertificateBodyView idioma={certificado.idioma} nivel={certificado.nivel} horas={certificado.cantidadHoras} />
                )}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 2, marginTop: 7 }}>
                    <View>{certificado.duplicado ? <View style={styles.duplicate}><Text style={styles.duplicateText}>DUPLICADO</Text></View> : null}</View>
                    <View>
                        <Text style={styles.script}>Callao, <Text style={{ fontSize: 16, fontWeight: "bold" }}>{issueDate}</Text></Text>
                        <Image style={{ marginBottom: 5, marginHorizontal: 20, width: 150, marginTop: 20 }} src={imageSource(director)} />
                    </View>
                </View>
                <View style={{ marginTop: 5 }}><Text style={styles.script}>N° de Registro: <Text style={styles.strong}>{certificado.numeroRegistro}</Text></Text></View>
            </Page>

            <Page size="A4" style={[styles.page, { paddingHorizontal: 65 }]}>
                <Text style={{ fontSize: 30, textAlign: "center", fontFamily: "Roboto-Bold", marginTop: 10, marginBottom: 20 }}>NIVEL {certificado.nivel}</Text>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <View style={[styles.headerCol, { width: "38%" }]}><Text style={styles.headerText}>CURSO</Text></View>
                        <View style={[styles.headerCol, { width: "38%" }]}><Text style={styles.headerText}>CICLO</Text></View>
                        <View style={[styles.headerCol, { width: "24%" }]}><Text style={styles.headerText}>NOTAS</Text></View>
                    </View>
                </View>
                <View style={{ marginBottom: 5 }}>
                    {rows.map((item, index) => (
                        <View style={styles.row} key={`${item.ciclo}-${index}`} wrap={false}>
                            <View style={[styles.col, { width: "38%" }]}><Text style={styles.cellText}>{item.ciclo}</Text></View>
                            <View style={[styles.col, { width: "38%" }]}>
                                {item.modalidad ? <Text style={styles.cellText}>{`${item.periodo} (${item.modalidad})`}</Text> : null}
                                {certificado.curriculaAnterior && index === 8 ? (
                                    <View style={{ borderWidth: 2, borderColor: "black", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.cellText, { textAlign: "center" }]}>CURRICULA ANTIGUA</Text>
                                    </View>
                                ) : null}
                            </View>
                            <View style={[styles.col, { width: "24%" }]}>{item.nota !== 0 ? <Text style={styles.cellText}>{item.nota}</Text> : null}</View>
                        </View>
                    ))}
                </View>
                <Text style={{ fontSize: 14, textAlign: "center", fontFamily: "Dancing Script", marginTop: 5, marginBottom: 20 }}>Curso Concluido : {conclusionDate}</Text>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <View style={[styles.col, { width: "33.33%" }]}><Image style={styles.signature} src={imageSource(elaborador)} /></View>
                        <View style={[styles.col, { width: "33.33%" }]}><Image style={styles.signature} src={imageSource(coordinadora)} /></View>
                        <View style={[styles.col, { width: "33.33%" }]}><Image style={styles.signature} src={imageSource(director)} /></View>
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 25 }}>
                    <View style={{ fontSize: 10 }}>
                        <Text style={{ fontSize: 12, fontFamily: "Roboto-Bold" }}>IMPORTANTE:</Text>
                        <Text>La nota mínima aprobatoria es de 75 puntos</Text>
                        <View style={{ marginTop: 10 }}><Text>*EX.U. EXAMEN DE UBICACIÓN.</Text><Text>*C.I. CICLO INTENSIVO.</Text><Text>*C.R. CICLO REGULAR.</Text></View>
                    </View>
                    <View style={{ position: "absolute", alignItems: "center", fontSize: 9, bottom: -10, right: -20, width: "50%", paddingTop: 20 }}>
                        {certificado.duplicado ? <View style={styles.duplicate}><Text style={styles.duplicateText}>DUPLICADO</Text><Text>DEL CERTIFICADO N° {certificado.certificadoOriginal}</Text></View> : null}
                        <Text>{certificado.estudiante}</Text>
                        <Text>Registrado en el libro de Certificados</Text>
                        <Text>Nivel {certificado.nivel} bajo el N° {certificado.numeroRegistro}</Text>
                        <Text>Elaborado por: {certificado.elaboradoPor}</Text>
                        <Text>Callao, {issueDate}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
