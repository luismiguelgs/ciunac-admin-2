import { StyleSheet, Document, Page, View, Text, Font, Image } from '@react-pdf/renderer'
import logoCiunac from '@/assets/logo-ciunac-trans.png'
import logoUnac from '@/assets/unac-logo.png'

Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf' })


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
        marginBottom: 10, // Espacio debajo de la línea
    },
    yearText: {
        fontSize: 12,
        fontFamily: 'Roboto',
        marginTop: 10, // Espacio entre la imagen y el texto
    },
    constanciaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    bodyText: {
        fontSize: 14,
        textAlign: 'justify', // Texto justificado
        fontFamily: 'Roboto',
        lineHeight: 1.5, // Espaciado entre líneas
    },
})

type Props = {
    estudiante: string,
    dni: string,
    curso: string,
    nivel: string,
    ciclo: string,
    modalidad: string,
    horario: string,
    fecha: string,
}

export default function MatriculaFormat({ estudiante, dni, curso, nivel, ciclo, modalidad, horario, fecha }: Props) {
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
                    <Text style={styles.constanciaTitle}>CONSTANCIA DE MÁTRICULA</Text>
                </View>
                {/* Cuerpo del texto */}
                <Text style={styles.bodyText}>
                    El director del Centro de Idiomas de la Universidad Nacional del Callao, hace constar:
                    {"\n\n"}
                    Que, el (la) estudiante {(estudiante || '').toLocaleUpperCase()}, identificado con DNI {dni || ''}, se encuentra matriculado(a) en el curso {curso || ''},
                    nivel {nivel || ''}, ciclo {ciclo || ''}, modalidad {modalidad || ''}, en el horario {horario || ''}.
                    {"\n\n"}
                    Se expide el presente, a solicitud de la parte interesada para los fines pertinentes.
                </Text>
                <View style={{ textAlign: 'right', marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        Callao, {fecha}
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
