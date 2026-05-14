'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import { IConstancia } from "../constancias.interface"

interface ConstanciaPdfButtonProps {
    constancia: IConstancia
}

export function ConstanciaPdfButton({ constancia }: ConstanciaPdfButtonProps) {
    const [isClient, setIsClient] = React.useState(false)
    const [isGenerating, setIsGenerating] = React.useState(false)

    React.useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return (
            <Button variant="outline" disabled className="gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando...
            </Button>
        )
    }

    const handleDownload = async () => {
        setIsGenerating(true)
        try {
            // Dynamic import to avoid SSR issues with react-pdf
            const { pdf } = await import("@react-pdf/renderer")
            const MatriculaFormat = (await import("../formatos/matricula.format")).default
            const NotasFormat = (await import("../formatos/notas.format")).default

            const fecha = new Date().toLocaleDateString('es-PE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })

            const document = constancia.tipo === 'MATRICULA' ? (
                <MatriculaFormat
                    estudiante={constancia.estudiante || ''}
                    dni={constancia.dni || ''}
                    curso={constancia.idioma || ''}
                    nivel={String(constancia.nivel || '')}
                    ciclo={String(constancia.ciclo || '')}
                    modalidad={constancia.modalidad || 'REGULAR'}
                    horario={constancia.horario || ''}
                    fecha={fecha}
                />
            ) : (
                <NotasFormat
                    estudiante={constancia.estudiante || ''}
                    dni={constancia.dni || ''}
                    curso={constancia.idioma || ''}
                    nivel={String(constancia.nivel || '')}
                    ciclo={String(constancia.ciclo || '')}
                    fecha={fecha}
                    detalle={constancia.detalle}
                />
            )

            const blob = await pdf(document).toBlob()
            const fileName = `constancia_${(constancia.tipo || 'doc').toLowerCase()}_${constancia.dni || 'sin-dni'}.pdf`

            // Trigger download
            const url = URL.createObjectURL(blob)
            const link = window.document.createElement('a')
            link.href = url
            link.download = fileName
            link.click()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error generando PDF:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button variant="outline" disabled={isGenerating} className="gap-2" onClick={handleDownload}>
            {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <FileText className="h-4 w-4" />
            )}
            {isGenerating ? 'Generando PDF...' : 'Ver Constancia'}
        </Button>
    )
}
