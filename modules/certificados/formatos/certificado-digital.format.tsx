import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import banderas from "@/assets/banderas.png"
import logoCiunac from "@/assets/logo-ciunac-trans.png"
import logoUnac from "@/assets/unac-logo.png"
import type { ICertificado, ICertificadoNota } from "../certificado.interface"
import { capitalizeCertificateName } from "../certificados.utils"
import { CertificateBodyView } from "./body-view"

Font.register({ family: "Dancing Script", src: "/fonts/DancingScript-VariableFont_wght.ttf" })
Font.register({ family: "PinyonScript", src: "/fonts/PinyonScript-Regular.ttf" })
Font.register({ family: "Roboto-Bold", src: "/fonts/Roboto-Bold.ttf" })

const imageSource = (image: { src: string } | string) => typeof image === "string" ? image : image.src

const styles = StyleSheet.create({
    page: { paddingTop: 25, paddingBottom: 25, paddingHorizontal: 10, backgroundColor: "#FCFCF0" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    watermark: { position: "absolute", top: "35%", left: "25%", opacity: 0.1, width: 280, height: 400, zIndex: -1 },
    script: { fontSize: 18, fontFamily: "Dancing Script", lineHeight: 1.5 },
    student: { fontSize: 24, fontFamily: "PinyonScript", textAlign: "center", marginHorizontal: "auto" },
    strong: { fontSize: 18, fontFamily: "Roboto-Bold", marginHorizontal: 6 },
    table: { width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf" },
    row: { flexDirection: "row" },
    headerCol: { borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf", padding: 3 },
    col: { borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf", padding: 3 },
    headerText: { fontSize: 26, fontFamily: "Roboto-Bold", margin: "auto", marginTop: 5 },
    cellText: { fontFamily: "Roboto-Bold", margin: "auto", marginTop: 5, paddingVertical: 5, fontSize: 13 },
    duplicate: { borderWidth: 2, borderColor: "black", padding: 5, margin: 10, textAlign: "center", width: "auto", alignSelf: "center", marginLeft: 55 },
    duplicateText: { fontFamily: "Roboto-Bold", fontSize: 20, textAlign: "center", alignSelf: "center", textTransform: "uppercase" },
    banner: { position: "absolute", bottom: 5, left: 0, right: 0, flexDirection: "row", alignItems: "flex-end" },
    bannerImage: { height: 14 },
})

function formatLongDate(value: string | Date): string {
    return new Date(value).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Lima" })
}

function getRows(notas: ICertificadoNota[]): ICertificadoNota[] {
    const rows = notas.toSorted((a, b) => Number(a.ciclo.match(/\d+$/)?.[0] || 0) - Number(b.ciclo.match(/\d+$/)?.[0] || 0)).map(item => ({ ...item }))
    while (rows.length < 9) rows.push({ ciclo: "", periodo: "", modalidad: "", nota: 0 })
    return rows
}

const Banner = ({ page }: { page: number }) => (
    <View style={styles.banner} fixed>
        {Array.from({ length: 7 }).map((_, index) => <Image key={`flag-${page}-${index}`} style={styles.bannerImage} src={imageSource(banderas)} />)}
    </View>
)

export function CertificadoDigitalFormat({ certificado, qrCode, validationUrl }: { certificado: ICertificado; qrCode: string; validationUrl: string }) {
    const rows = getRows(certificado.notas || [])
    const issueDate = formatLongDate(certificado.fechaEmision)
    const conclusionDate = formatLongDate(certificado.fechaConcluido)

    return (
        <Document title={`Certificado ${certificado.numeroRegistro}`} author="Centro de Idiomas - UNAC">
            <Page size="A4" style={[styles.page, { paddingHorizontal: 25 }]}>
                <View style={styles.header}>
                    <Image src={imageSource(logoUnac)} style={{ width: 80, height: 110 }} />
                    <View style={{ textAlign: "center", flex: 1, alignItems: "center", marginLeft: 20 }}>
                        <Text style={{ fontSize: 18, fontFamily: "Roboto-Bold" }}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                        <Text style={{ fontSize: 25, fontFamily: "Roboto-Bold" }}>CENTRO DE IDIOMAS</Text>
                    </View>
                    <Image src={imageSource(logoCiunac)} style={{ width: 100, height: 100 }} />
                </View>
                <Image src={imageSource(logoUnac)} style={styles.watermark} />
                <Text style={{ fontSize: 20, fontFamily: "Dancing Script", textAlign: "center", marginTop: 10 }}>El director del Centro de Idiomas</Text>
                <Text style={{ fontSize: 70, textAlign: "center", fontFamily: "PinyonScript", marginTop: 20, marginBottom: 40 }}>Certifica</Text>
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 2, paddingHorizontal: 55 }}>
                    <Text style={styles.script}>Que</Text>
                    <View style={{ flexGrow: 1, borderBottomWidth: 1, borderBottomColor: "black", borderBottomStyle: "solid", marginHorizontal: 5 }}>
                        <Text style={styles.student}>{capitalizeCertificateName(certificado.estudiante)}</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 55 }}><CertificateBodyView idioma={certificado.idioma} nivel={certificado.nivel} horas={certificado.cantidadHoras} /></View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 7 }}>
                    <View>{certificado.duplicado ? <View style={styles.duplicate}><Text style={styles.duplicateText}>DUPLICADO</Text></View> : null}</View>
                    <View style={{ paddingRight: 55 }}><Text style={styles.script}>Callao, <Text style={{ fontSize: 16, fontWeight: "bold" }}>{issueDate}</Text></Text></View>
                </View>
                <View style={{ alignItems: "flex-start", marginTop: 25, paddingLeft: 55 }}><View style={{ width: 200, alignItems: "center", marginBottom: 6 }}><Image style={{ width: 100 }} src={qrCode} /></View></View>
                <Text style={[styles.script, { marginTop: 10, paddingLeft: 55, fontSize: 14 }]}>N° de Registro: <Text style={[styles.strong, { fontSize: 14 }]}>{certificado.numeroRegistro}</Text></Text>
                <Banner page={1} />
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
                                {certificado.curriculaAnterior && index === 8 ? <View style={{ borderWidth: 2, borderColor: "black", alignItems: "center" }}><Text style={styles.cellText}>CURRICULA ANTIGUA</Text></View> : null}
                            </View>
                            <View style={[styles.col, { width: "24%" }]}>{item.nota !== 0 ? <Text style={styles.cellText}>{item.nota}</Text> : null}</View>
                        </View>
                    ))}
                </View>
                <Text style={{ fontSize: 14, textAlign: "center", fontFamily: "Dancing Script", marginTop: 5, marginBottom: 20 }}>Curso Concluido : {conclusionDate}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 50 }}>
                    <View style={{ fontSize: 10 }}>
                        <Text style={{ fontSize: 12, fontFamily: "Roboto-Bold" }}>IMPORTANTE:</Text><Text>La nota mínima aprobatoria es de 75 puntos</Text>
                        <View style={{ marginTop: 10 }}><Text>*EX.U. EXAMEN DE UBICACIÓN.</Text><Text>*C.I. CICLO INTENSIVO.</Text><Text>*C.R. CICLO REGULAR.</Text></View>
                    </View>
                    <View style={{ position: "absolute", alignItems: "center", fontSize: 9, bottom: -10, right: -20, width: "50%", paddingTop: 20 }}>
                        {certificado.duplicado ? <View style={styles.duplicate}><Text style={styles.duplicateText}>DUPLICADO</Text><Text>DEL CERTIFICADO N° {certificado.certificadoOriginal}</Text></View> : null}
                        <Text>Registrado en el libro de Certificados</Text><Text>Nivel {certificado.nivel} bajo el N° {certificado.numeroRegistro}</Text><Text>Elaborado por: {certificado.elaboradoPor}</Text><Text>Callao, {issueDate}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center", width: "100%", marginTop: 10 }}>
                    <Link src={validationUrl} style={{ fontSize: 10, marginTop: 15, color: "#0659A7", textDecoration: "underline" }}>{validationUrl}</Link>
                    <Text style={{ fontSize: 12, textAlign: "center", fontFamily: "Roboto-Bold", marginTop: 15 }}>Av. Juan Pablo II N° 310 Bellavista - Callao</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                        <Text style={{ fontSize: 12, fontFamily: "Roboto-Bold", marginRight: 12 }}>(01) 4291931</Text>
                        <Text style={{ fontSize: 12, fontFamily: "Roboto-Bold", marginRight: 12 }}>ciunac.unac.edu.pe</Text>
                        <Text style={{ fontSize: 12, fontFamily: "Roboto-Bold" }}>ciunac.certificados@unac.edu.pe</Text>
                    </View>
                </View>
                <Banner page={2} />
            </Page>
        </Document>
    )
}
