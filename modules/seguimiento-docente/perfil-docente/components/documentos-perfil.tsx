'use client'

import IDocumentosPerfil from "../interfaces/documentos-perfil.interface"
import SeccionDocumentos, { type SeccionTipo } from "./seccion-documentos"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import React from "react"
import DocumentoForm from "../forms/documento.form"
import { useRouter } from "next/navigation"

// Mapeo exacto de tipoDocumentoPerfil.nombre a sección
const TIPO_A_SECCION: Record<string, SeccionTipo> = {
    "TÍTULO (LICENCIATURA)": "grados",
    "GRADO_MAESTRIA": "grados",
    "GRADO_DOCTORADO": "grados",
    "CERTIFICADO_IDIOMA": "diplomas",
    "CERTIFICADO_INTERNACIONAL": "diplomas",
    "CAPACITACIÓN_METODOLÓGICA": "capacitaciones",
    "CAPACITACIÓN_EXTRA": "capacitaciones",
    "EXPERIENCIA": "experiencia",
}

function clasificarDocumento(doc: IDocumentosPerfil): SeccionTipo {
    const nombre = doc.tipoDocumentoPerfil?.nombre ?? ""
    return TIPO_A_SECCION[nombre] ?? "diplomas"
}

function agruparDocumentos(documentos: IDocumentosPerfil[]): Record<SeccionTipo, IDocumentosPerfil[]> {
    const grupos: Record<SeccionTipo, IDocumentosPerfil[]> = {
        grados: [],
        diplomas: [],
        capacitaciones: [],
        experiencia: [],
    }
    for (const doc of documentos) {
        const seccion = clasificarDocumento(doc)
        grupos[seccion].push(doc)
    }
    return grupos
}

const SECCIONES_ORDEN: SeccionTipo[] = ["grados", "diplomas", "capacitaciones", "experiencia"]

export default function DocumentosPerfil({ documentos, perfilId }: { documentos: IDocumentosPerfil[], perfilId: string }) {
    const grupos = agruparDocumentos(documentos)
    const [selectedDoc, setSelectedDoc] = React.useState<IDocumentosPerfil | undefined>()
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const router = useRouter()

    const handleEditar = (documento: IDocumentosPerfil) => {
        setSelectedDoc(documento)
        setIsSheetOpen(true)
    }

    const handleNuevo = () => {
        setSelectedDoc(undefined)
        setIsSheetOpen(true)
    }

    const handleSuccess = () => {
        setIsSheetOpen(false)
        router.refresh()
    }

    return (
        <div className="space-y-6 mt-6">
            <h2 className="text-xl font-bold">Documentos del Perfil</h2>
            {SECCIONES_ORDEN.map((seccion) => (
                <SeccionDocumentos
                    key={seccion}
                    tipo={seccion}
                    documentos={grupos[seccion]}
                    onEditar={handleEditar}
                    onNuevo={handleNuevo}
                />
            ))}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md p-2">
                    <SheetHeader>
                        <SheetTitle>{selectedDoc ? 'Editar Documento' : 'Nuevo Documento'}</SheetTitle>
                        <SheetDescription>
                            {selectedDoc ? 'Modifique la información del documento seleccionado.' : 'Complete la información para registrar un nuevo documento.'}
                        </SheetDescription>
                    </SheetHeader>
                    <DocumentoForm
                        documento={selectedDoc}
                        perfilDocenteId={perfilId}
                        onSuccess={handleSuccess}
                    />
                </SheetContent>
            </Sheet>
        </div>
    )
}