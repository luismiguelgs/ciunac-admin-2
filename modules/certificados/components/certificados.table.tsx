"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { BadgeCheck, Eye, FileDown, FileText, Loader2, PackageCheck } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { DataTable } from "@/components/datatable/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ICertificado } from "../certificado.interface"
import { CertificadosService } from "../certificados.service"
import { getCertificadoId, isCertificadoDigital } from "../certificados.utils"
import { CertificadoFirmaButton } from "./certificado-firma.button"
import { CertificadoPdfButton } from "./certificado-pdf.button"
import { CertificadoUploadButton } from "./certificado-upload.button"

export function CertificadosTable({ initialData, signed }: { initialData: ICertificado[]; signed: boolean }) {
    const [data, setData] = React.useState(initialData)
    const [processingId, setProcessingId] = React.useState<string | null>(null)

    function removeFromCurrentList(certificado: ICertificado) {
        const id = getCertificadoId(certificado)
        setData(current => current.filter(item => getCertificadoId(item) !== id))
    }

    async function handleDelivered(certificado: ICertificado) {
        const id = getCertificadoId(certificado)
        if (!id) return
        setProcessingId(id)
        try {
            const updated = await CertificadosService.updateAceptado(id, !certificado.aceptado)
            setData(current => current.map(item => getCertificadoId(item) === id ? { ...item, ...updated } : item))
            toast.success(updated.aceptado ? "Certificado marcado como entregado" : "Entrega revertida")
        } catch (error) {
            console.error(error)
            toast.error("No se pudo actualizar la entrega")
        } finally {
            setProcessingId(null)
        }
    }

    const columns = React.useMemo<ColumnDef<ICertificado>[]>(() => [
        {
            id: "busqueda",
            accessorFn: row => `${row.estudiante} ${row.numeroDocumento} ${row.numeroRegistro}`,
            header: "Busqueda",
            enableHiding: false,
        },
        { accessorKey: "numeroRegistro", header: "N° registro" },
        {
            accessorKey: "tipo",
            header: "Formato",
            cell: ({ row }) => {
                const digital = isCertificadoDigital(row.original.tipo)
                return <Badge variant="outline" className={digital ? "border-violet-200 bg-violet-50 text-violet-700" : "border-sky-200 bg-sky-50 text-sky-700"}>{digital ? <FileDown className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}{digital ? "Digital" : "Fisico"}</Badge>
            },
        },
        { accessorKey: "estudiante", header: "Estudiante" },
        { accessorKey: "numeroDocumento", header: "Documento" },
        { accessorKey: "idioma", header: "Idioma" },
        { accessorKey: "nivel", header: "Nivel" },
        {
            accessorKey: "fechaEmision",
            header: "Fecha de Emisión",
            cell: ({ row }) => new Date(row.original.fechaEmision).toLocaleDateString("es-PE"),
        },
        {
            id: "estado",
            header: signed ? "Entrega" : "Estado",
            cell: ({ row }) => signed
                ? <Badge variant={row.original.aceptado ? "default" : "outline"}>{row.original.aceptado ? "Entregado" : "Pendiente"}</Badge>
                : <Badge variant="outline">Pendiente</Badge>,
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const item = row.original
                const id = getCertificadoId(item)
                const processing = processingId === id
                return (
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild title="Ver detalle"><Link href={`/certificados/${id}`}><Eye className="h-4 w-4 text-sky-600" /></Link></Button>
                        <CertificadoPdfButton certificado={item} iconOnly />
                        {!signed && isCertificadoDigital(item.tipo) && !item.url && !item.driveId ? <CertificadoUploadButton certificado={item} iconOnly /> : null}
                        {!signed ? <CertificadoFirmaButton certificado={item} iconOnly onComplete={() => removeFromCurrentList(item)} /> : null}
                        {signed ? (
                            <Button variant="ghost" size="icon" title={item.aceptado ? "Revertir entrega" : "Marcar entregado"} disabled={processing} onClick={() => handleDelivered(item)}>
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : item.aceptado ? <BadgeCheck className="h-4 w-4 text-emerald-600" /> : <PackageCheck className="h-4 w-4 text-blue-600" />}
                            </Button>
                        ) : null}
                    </div>
                )
            },
        },
    ], [processingId, signed])

    return (
        <DataTable
            columns={columns}
            data={data}
            filterColumn="busqueda"
            searchPlaceholder="Buscar por estudiante, documento o registro..."
            initialColumnVisibility={{ busqueda: false }}
            pageSize={25}
        />
    )
}
