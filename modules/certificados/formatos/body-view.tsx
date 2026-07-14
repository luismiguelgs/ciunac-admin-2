import { Font, StyleSheet, Text, View } from "@react-pdf/renderer"

Font.register({ family: "Roboto-Bold", src: "/fonts/Roboto-Bold.ttf" })
Font.register({ family: "Dancing Script", src: "/fonts/DancingScript-VariableFont_wght.ttf" })

const styles = StyleSheet.create({
    text: { fontSize: 18, fontFamily: "Dancing Script", lineHeight: 1.5, textAlign: "justify" },
    strong: { fontSize: 18, fontFamily: "Roboto-Bold", marginHorizontal: 6 },
})

function getCefrLevel(idioma: string, nivel: string): string | null {
    const language = idioma.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    const level = nivel.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()

    if (language === "INGLES") {
        if (level.includes("BASICO")) return "A2"
        if (level.includes("INTERMEDIO")) return "B2 (Usuario Independiente Inicial)"
        if (level.includes("AVANZADO")) return "C1"
    }
    if (["PORTUGUES", "ITALIANO", "FRANCES"].includes(language)) {
        if (level.includes("BASICO")) return "A2"
        if (level.includes("INTERMEDIO")) return "B1"
        if (level.includes("AVANZADO")) return "B2"
    }
    return null
}

export function CertificateBodyView({ idioma, nivel, horas }: { idioma: string; nivel: string; horas: number }) {
    const cefr = getCefrLevel(idioma, nivel)
    return (
        <View>
            {cefr ? (
                <Text style={styles.text} hyphenationCallback={word => [word]}>
                    ha concluido satisfactoriamente el <Text style={styles.strong}>{` NIVEL ${nivel} `}</Text>
                    del idioma <Text style={styles.strong}>{idioma}</Text>, de acuerdo al <Text style={{ fontFamily: "Roboto-Bold" }}>MARCO COMÚN EUROPEO DE REFERENCIA PARA LAS LENGUAS</Text>, en el nivel <Text style={styles.strong}>{cefr}</Text>, en nuestra Casa Superior de Estudios con un total de <Text style={styles.strong}>{horas}</Text> horas. Se le expide el presente, a solicitud de la parte interesada para los fines pertinentes.
                </Text>
            ) : (
                <>
                    <Text style={styles.text} hyphenationCallback={word => [word]}>
                        ha concluido satisfactoriamente el <Text style={styles.strong}>{` NIVEL ${nivel} `}</Text>
                        del idioma <Text style={styles.strong}>{idioma}</Text>, en nuestra Casa Superior de Estudios con un total de <Text style={styles.strong}>{horas}</Text> horas.
                    </Text>
                    <Text style={styles.text}>Se le expide el presente, a solicitud de la parte interesada para los fines pertinentes.</Text>
                    <View style={{ marginTop: 10 }} />
                </>
            )}
        </View>
    )
}
