import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import ciunacLogo from "@/assets/logo-ciunac-trans.png"
import signature from "@/assets/elaboradoring.jpg"
import unacLogo from "@/assets/unac-logo.png"
import type { ICertificadoReporteItem, ICertificadoReporteResponse } from "../../certificado-reporte.interface"

const imageSource = (image: { src: string } | string) => typeof image === "string" ? image : image.src

const styles = StyleSheet.create({
    page: { paddingTop: 30, paddingRight: 38, paddingBottom: 46, paddingLeft: 38, fontFamily: "Helvetica", fontSize: 9, color: "#171717" },
    letterhead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 70, marginBottom: 8 },
    logo: { width: 62, height: 62, objectFit: "contain" },
    ciunacLogo: { width: 105, height: 62, objectFit: "contain" },
    institution: { width: "62%", textAlign: "center", lineHeight: 1.35 },
    main: { fontFamily: "Helvetica-Bold", fontSize: 12 },
    secondary: { marginTop: 2, fontFamily: "Helvetica-Bold", fontSize: 10 },
    divider: { borderBottomWidth: 1, borderBottomColor: "#234b78", marginBottom: 12 },
    title: { marginBottom: 14, fontFamily: "Helvetica-Bold", fontSize: 12, textAlign: "center", textDecoration: "underline" },
    detail: { flexDirection: "row", marginBottom: 5, lineHeight: 1.3 },
    label: { width: 58, fontFamily: "Helvetica-Bold" },
    detailText: { flex: 1 },
    date: { marginTop: 7, marginBottom: 12, textAlign: "right", fontFamily: "Helvetica-Bold" },
    paragraph: { marginBottom: 13, fontSize: 9.5, lineHeight: 1.55, textAlign: "justify" },
    groupTitle: { paddingVertical: 6, paddingHorizontal: 8, backgroundColor: "#234b78", color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 9.5, textTransform: "uppercase" },
    table: { width: "100%", borderLeftWidth: 0.7, borderTopWidth: 0.7, borderColor: "#7c8794" },
    row: { flexDirection: "row", minHeight: 23 },
    header: { flexDirection: "row", minHeight: 25, backgroundColor: "#e8eef5" },
    cell: { justifyContent: "center", paddingVertical: 4, paddingHorizontal: 2, borderRightWidth: 0.7, borderBottomWidth: 0.7, borderColor: "#7c8794" },
    headerText: { fontFamily: "Helvetica-Bold", fontSize: 6.8, textAlign: "center" },
    cellText: { fontSize: 6.8, lineHeight: 1.25 },
    totals: { marginTop: 7, alignItems: "flex-end", fontFamily: "Helvetica-Bold" },
    signature: { width: 180, height: 62, objectFit: "contain" },
    footer: { position: "absolute", left: 38, right: 38, bottom: 22, paddingTop: 5, borderTopWidth: 0.5, borderTopColor: "#aeb7c1", color: "#5d6772", fontSize: 7.5, textAlign: "center" },
})

const widths = ["5%", "15%", "27%", "11%", "12%", "13%", "17%"] as const

function getDateParts(date: Date) {
    const parts = new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "long", year: "numeric" }).formatToParts(date)
    return {
        day: parts.find(part => part.type === "day")?.value || "",
        month: parts.find(part => part.type === "month")?.value.toLocaleLowerCase("es-PE") || "",
        year: parts.find(part => part.type === "year")?.value || "",
    }
}

export function getCertificadoReporteYear(date = new Date()): string {
    return getDateParts(date).year
}

function sortItems(items: ICertificadoReporteItem[]) {
    return items.toSorted((a, b) => a.numeroRegistro.localeCompare(b.numeroRegistro, "es", { numeric: true, sensitivity: "base" }))
}

function getGroups(data: ICertificadoReporteResponse) {
    return [
        { title: "Certificados básicos digitales", items: sortItems(data.basico?.digitales || []) },
        { title: "Certificados básicos físicos", items: sortItems(data.basico?.fisicos || []) },
        { title: "Certificados intermedios y avanzados digitales", items: sortItems(data.intermedioAvanzado?.digitales || []) },
        { title: "Certificados intermedios y avanzados físicos", items: sortItems(data.intermedioAvanzado?.fisicos || []) },
    ].filter(group => group.items.length)
}

function ReportTable({ title, items }: { title: string; items: ICertificadoReporteItem[] }) {
    const headers = ["N°", "N° REGISTRO", "ALUMNO", "IDIOMA", "NIVEL", "PERIODO", "N° VOUCHER"]
    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={styles.groupTitle}>{title}</Text>
            <View style={styles.table}>
                <View style={styles.header} wrap={false}>{headers.map((header, index) => <View key={header} style={[styles.cell, { width: widths[index] }]}><Text style={styles.headerText}>{header}</Text></View>)}</View>
                {items.map((item, index) => {
                    const values = [index + 1, item.numeroRegistro, item.alumno, item.idioma, item.nivel, item.periodo, item.numeroVoucher]
                    return <View key={`${item.numeroRegistro}-${index}`} style={styles.row} wrap={false}>{values.map((value, cellIndex) => <View key={cellIndex} style={[styles.cell, { width: widths[cellIndex] }]}><Text style={[styles.cellText, cellIndex !== 2 ? { textAlign: "center" } : {}]}>{String(value || "")}</Text></View>)}</View>
                })}
            </View>
            <View style={styles.totals}><Text>Subtotal: {items.length} certificado{items.length === 1 ? "" : "s"}</Text></View>
        </View>
    )
}

export function CertificadoReporteFormat({ data, reportNumber, generatedAt = new Date() }: { data: ICertificadoReporteResponse; reportNumber: string; generatedAt?: Date }) {
    const date = getDateParts(generatedAt)
    const reportTitle = `INFORME N° ${reportNumber}-${date.year}-CAGDLCP`
    const groups = getGroups(data)
    const total = groups.reduce((sum, group) => sum + group.items.length, 0)

    return (
        <Document title={reportTitle} author="Centro de Idiomas - UNAC" subject="Relación de certificados para firma">
            <Page size="A4" style={styles.page} wrap>
                <View style={styles.letterhead}>
                    <Image src={imageSource(unacLogo)} style={styles.logo} />
                    <View style={styles.institution}><Text style={styles.main}>UNIVERSIDAD NACIONAL DEL CALLAO</Text><Text style={styles.secondary}>CENTRO DE IDIOMAS</Text></View>
                    <Image src={imageSource(ciunacLogo)} style={styles.ciunacLogo} />
                </View>
                <View style={styles.divider} />
                <Text style={styles.title}>{reportTitle}</Text>
                <View style={styles.detail}><Text style={styles.label}>PARA:</Text><Text style={styles.detailText}>DR. NÉSTOR GOMERO OSTOS - DIRECTOR DEL CENTRO DE IDIOMAS</Text></View>
                <View style={styles.detail}><Text style={styles.label}>DE:</Text><Text style={styles.detailText}>CARLOS ANDRÉS GONZALES DE LA COTERA PALACIOS - ASISTENTE ADMINISTRATIVO</Text></View>
                <View style={styles.detail}><Text style={styles.label}>ASUNTO:</Text><Text style={[styles.detailText, { fontFamily: "Helvetica-Bold" }]}>INFORME SOBRE LA FIRMA DEL DIRECTOR EN LOS CERTIFICADOS DEL CENTRO DE IDIOMAS</Text></View>
                <Text style={styles.date}>{`CALLAO ${date.day} de ${date.month} ${date.year}`}</Text>
                <Text style={styles.paragraph}>Es grato dirigirme al despacho de su honorable cargo para expresarle mi fraternal saludo; asimismo, para informarle la relación numérica de los certificados de idiomas ejecutados con la rúbrica del director Néstor Gomero Ostos. A continuación, se detalla de la siguiente manera.</Text>
                {groups.map(group => <ReportTable key={group.title} title={group.title} items={group.items} />)}
                <View style={[styles.totals, { borderTopWidth: 1, borderTopColor: "#234b78", paddingTop: 4 }]}><Text>TOTAL GENERAL: {total} CERTIFICADOS</Text></View>
                <View style={{ marginTop: 10 }} wrap={false}><Text style={{ fontSize: 9.5, marginBottom: 2 }}>Es cuanto tengo que informar a usted.</Text><Text style={{ fontSize: 9.5 }}>Atentamente,</Text><Image src={imageSource(signature)} style={styles.signature} /></View>
                <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => `${reportTitle} | Página ${pageNumber} de ${totalPages}`} />
            </Page>
        </Document>
    )
}
