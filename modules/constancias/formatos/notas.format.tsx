import { StyleSheet, Document, Page, View, Text, Font, Image } from '@react-pdf/renderer'
import logoCiunac from '@/assets/logo-ciunac-trans.png'
import logoUnac from '@/assets/unac-logo.png'
import { IConstanciaDetalle } from '../constancias.interface'

Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf' })
Font.register({ family: 'Roboto-Bold', src: '/fonts/Roboto-Bold.ttf' })

const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        marginTop: 5,
    },
    horizontalLine: {
        borderBottomWidth: 2, // Grosor de la línea
        borderBottomColor: '#000', // Color de la línea
        borderBottomStyle: 'solid', // Estilo de la línea
        marginBottom: 5, // Espacio debajo de la línea
    },
    yearText: {
        fontSize: 12,
        fontFamily: 'Roboto',
        marginTop: 5, // Espacio entre la imagen y el texto
    },
    constanciaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    bodyText: {
        fontSize: 14,
        textAlign: 'justify', // Texto justificado
        fontFamily: 'Roboto',
        lineHeight: 1.5, // Espaciado entre líneas
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        padding: 3,
    },
    tableCellHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableCell: {
        fontSize: 10,
        textAlign: 'center',
    },
    tableCellText: {
        textAlign: 'center',
    },
    tableCol: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        padding: 3,
    },
})

type Props = {
    estudiante: string,
    dni: string,
    curso: string,
    nivel: string,
    ciclo: string,
    fecha: string,
    id_constancia?: string | undefined
    detalle?: IConstanciaDetalle[] | undefined,
}

export default function NotasFormat({ estudiante, dni, curso, nivel, ciclo, fecha, detalle }: Props) {

    // Sort detalle array by nivel and ciclo
    const sortedDetalle = detalle ? [...detalle].sort((a, b) => {
        const nivelA = String(a.nivel ?? '');
        const nivelB = String(b.nivel ?? '');
        
        // First sort by nivel
        const nivelComparison = nivelA.localeCompare(nivelB);
        
        // If niveles are equal, sort by ciclo
        if (nivelComparison === 0) {
            const cicloA = Number(a.ciclo) || 0;
            const cicloB = Number(b.ciclo) || 0;
            return cicloA - cicloB;
        }
        return nivelComparison;
    }) : undefined;

    const constanciaDetalle = sortedDetalle?.map((item, index) => {
        return (
            <View style={styles.tableRow} key={index}>
                <View style={[styles.tableCol, { width: '15%' }]}>
                    <Text style={styles.tableCell}>{item.idioma}</Text>
                </View>
                <View style={[styles.tableCol, { width: '12.5%' }]}>
                    <Text style={styles.tableCell}>{item.nivel}</Text>
                </View>
                <View style={[styles.tableCol, { width: '10%' }]}>
                    <Text style={styles.tableCell}>{item.ciclo}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                    <Text style={styles.tableCell}>{item.modalidad}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                    <Text style={styles.tableCell}>{item.mes}</Text>
                </View>
                <View style={[styles.tableCol, { width: '10%' }]}>
                    <Text style={styles.tableCell}>{item.año}</Text>
                </View>
                <View style={[styles.tableCol, { width: '12.5%' }]}>
                    <Text style={styles.tableCell}>{item.aprobado ? 'APROBADO' : 'REPROBADO'}</Text>
                </View>
                <View style={[styles.tableCol, { width: '10%' }]}>
                    <Text style={styles.tableCell}>{item.nota}</Text>
                </View>
            </View>
        )
    })
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {/* Logo izquierdo */}
                    <Image src={logoUnac.src} style={{ width: 90, height: 120 }} />

                    {/* Textos en el medio */}
                    <View style={{ textAlign: 'center', fontFamily: 'Roboto', flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                        <Text style={styles.subtitle}>VICERRECTORADO ACADÉMICO</Text>
                        <Text style={styles.subtitle}>CENTRO DE IDIOMAS</Text>
                    </View>

                    {/* Logo derecho */}
                    <Image src={logoCiunac.src} style={{ width: 120, height: 120 }} />
                </View>
                {/* Línea horizontal */}
                <View style={styles.horizontalLine} />
                <View style={{ textAlign: 'center', alignItems: 'center' }}>
                    <Text style={styles.yearText}>&quot;Año de la unidad, la paz y el desarrollo&quot;</Text>
                </View>

                {/* Título "CONSTANCIA DE ..." */}
                <View style={{ textAlign: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                    <Text style={styles.constanciaTitle}>CONSTANCIA DE NOTAS</Text>
                </View>
                {/* Cuerpo del texto */}
                <Text style={styles.bodyText}>
                    El director del Centro de Idiomas de la Universidad Nacional del Callao, hace constar:
                    {"\n"}
                    Que, el (la) estudiante {(estudiante || '').toLocaleUpperCase()}, identificado con DNI {dni || ''}, ha cursado y aprobado el idioma {curso || ''},
                    hasta {nivel || ''} {ciclo || ''}, obteniendo las siguienes calificaciones.
                    {"\n\n"}
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, { width: '15%' }]}>
                            <Text style={styles.tableCellHeader}>IDIOMA</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '12.5%' }]}>
                            <Text style={styles.tableCellHeader}>NIVEL</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '10%' }]}>
                            <Text style={styles.tableCellHeader}>CICLO</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '15%' }]}>
                            <Text style={styles.tableCellHeader}>MODALIDAD</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '15%' }]}>
                            <Text style={styles.tableCellHeader}>MES</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '10%' }]}>
                            <Text style={styles.tableCellHeader}>AÑO</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '12.5%' }]}>
                            <Text style={styles.tableCellHeader}>ESTADO</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '10%' }]}>
                            <Text style={styles.tableCellHeader}>NOTA</Text>
                        </View>
                    </View>
                </View>
                {constanciaDetalle}
                <Text style={styles.bodyText}>
                    {"\n\n"}
                    Se expide el presente, a solicitud de la parte interesada para los fines pertinentes.
                </Text>
                <View style={{ textAlign: 'right', marginTop: 20 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        Callao, {fecha}
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
