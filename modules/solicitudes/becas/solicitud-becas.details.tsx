'use client'

import React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ISolicitudBeca from "./solicitud-becas.interface"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { User, ClipboardList, MessageSquare, Save, CheckCircle, XCircle, Clock, FileText, ExternalLink, ArrowLeft, Eye } from "lucide-react"
import SolicitudbecasService from "./solicitud-becas.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatDate, cn } from "@/lib/utils"

interface SolicitudBecaDetailsProps {
    solicitud: ISolicitudBeca
}

const getStatusConfig = (status?: string) => {
    switch (status?.toLowerCase()) {
        case 'aprobado':
            return { variant: 'default' as const, label: 'APROBADO', icon: <CheckCircle className="w-4 h-4" /> }
        case 'rechazado':
            return { variant: 'destructive' as const, label: 'RECHAZADO', icon: <XCircle className="w-4 h-4" /> }
        case 'pendiente':
        case 'nuevas':
        default:
            return { variant: 'secondary' as const, label: 'PENDIENTE', icon: <Clock className="w-4 h-4" /> }
    }
}

const transformGoogleDriveUrl = (url: string): string => {
    if (!url) return url;

    try {
        // Verificamos si es un dominio de Google (Drive, Docs, etc.)
        if (!url.includes('google.com')) return url;

        // Intentamos obtener el ID del archivo
        let fileId = "";

        // Caso 1: El ID está en un parámetro 'id' (común en uc?id= o open?id=)
        if (url.includes('id=')) {
            const urlObj = new URL(url);
            fileId = urlObj.searchParams.get('id') || "";
        }

        // Caso 2: El ID está en la ruta /d/EL_ID/...
        if (!fileId && url.includes('/d/')) {
            const pathMatch = url.match(/\/d\/([^/&#?]+)/);
            if (pathMatch) fileId = pathMatch[1];
        }

        // Si encontramos un ID, reconstruimos la URL hacia la vista de previsualización
        if (fileId) {
            return `https://drive.google.com/file/d/${fileId}/view`;
        }
    } catch (e) {
        console.error("Error al transformar URL de Google Drive:", e);
    }

    return url;
};

export function SolicitudBecaDetails({ solicitud }: SolicitudBecaDetailsProps) {
    const router = useRouter()
    const [observations, setObservations] = React.useState(solicitud.observaciones || "")
    const [isSaving, setIsSaving] = React.useState(false)
    const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false)

    const handleSaveObservations = async () => {
        setIsSaving(true)
        const id = String(solicitud._id || solicitud.id!)
        const success = await SolicitudbecasService.update(id, { observaciones: observations })
        if (success) {
            toast.success("Observaciones guardadas correctamente")
            router.refresh()
        } else {
            toast.error("Error al guardar observaciones")
        }
        setIsSaving(false)
    }

    const handleUpdateStatus = async (newStatus: string) => {
        setIsUpdatingStatus(true)
        const id = String(solicitud._id || solicitud.id!)
        const success = await SolicitudbecasService.update(id, { estado: newStatus })
        if (success) {
            toast.success(`Estado actualizado a ${newStatus}`)
            router.refresh()
        } else {
            toast.error("Error al actualizar el estado")
        }
        setIsUpdatingStatus(false)
    }

    const statusConfig = getStatusConfig(solicitud.estado)

    const InfoField = ({ label, value, icon, className }: { label: string, value?: string, icon?: React.ReactNode, className?: string }) => (
        <div className={cn("flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors", className)}>
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                {icon}
                {label}
            </Label>
            <span className="text-sm font-semibold truncate" title={value}>{value || "No especificado"}</span>
        </div>
    )

    const DocumentLink = ({ label, url }: { label: string, url?: string }) => (
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary/10 text-primary">
                    <FileText className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{label}</span>
            </div>
            {url ? (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                        const viewUrl = transformGoogleDriveUrl(url);
                        window.open(viewUrl, "_blank", "noopener,noreferrer");
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver documento
                </Button>
            ) : (
                <Badge variant="outline" className="text-[10px]">No adjunto</Badge>
            )}
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
                <CardHeader className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                                    <ClipboardList className="w-6 h-6" />
                                </div>
                                Detalle de Solicitud
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Gestión de beca para <span className="font-bold text-foreground">{solicitud.nombres} {solicitud.apellidos}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-background/50 p-2 rounded-xl border border-border/40 shadow-inner">
                            <span className="text-xs font-bold text-muted-foreground ml-2 hidden sm:inline">ESTADO ACTUAL:</span>
                            <Badge variant={statusConfig.variant} className="px-4 py-1.5 font-black flex items-center gap-2 rounded-lg shadow-sm">
                                {statusConfig.icon}
                                {statusConfig.label}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <Accordion type="multiple" defaultValue={["estudiante", "solicitud", "gestion"]} className="w-full space-y-4">
                        
                        <AccordionItem value="estudiante" className="border rounded-xl px-4 bg-background/40 hover:bg-background/60 transition-colors shadow-sm">
                            <AccordionTrigger className="hover:no-underline font-bold text-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-data-[state=open]:rotate-3 transition-transform">
                                        <User className="w-5 h-5" />
                                    </div>
                                    Información del Estudiante
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoField label="Nombres" value={solicitud.nombres} />
                                    <InfoField label="Apellidos" value={solicitud.apellidos} />
                                    <InfoField label="Documento" value={`${solicitud.tipo_documento}: ${solicitud.numero_documento}`} />
                                    <InfoField label="Código" value={solicitud.codigo} />
                                    <InfoField label="Email" value={solicitud.email} />
                                    <InfoField label="Teléfono" value={solicitud.telefono} />
                                    <InfoField label="Facultad" value={solicitud.facultad} className="lg:col-span-1" />
                                    <InfoField label="Escuela" value={solicitud.escuela} className="lg:col-span-1" />
                                    <InfoField label="Dirección" value={solicitud.direccion} className="lg:col-span-1" />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="solicitud" className="border rounded-xl px-4 bg-background/40 hover:bg-background/60 transition-colors shadow-sm">
                            <AccordionTrigger className="hover:no-underline font-bold text-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-data-[state=open]:rotate-3 transition-transform">
                                        <ClipboardList className="w-5 h-5" />
                                    </div>
                                    Información de la Solicitud
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-6 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <InfoField label="Periodo" value={solicitud.periodo} />
                                    <InfoField label="Creado en" value={solicitud.creado_en ? formatDate(solicitud.creado_en) : "N/A"} />
                                    <InfoField label="Modificado en" value={solicitud.modificado_en ? formatDate(solicitud.modificado_en) : "N/A"} />
                                    <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border/40">
                                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</Label>
                                        <Badge variant={statusConfig.variant} className="w-fit">{statusConfig.label}</Badge>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                                        <FileText className="w-4 h-4" />
                                        DOCUMENTOS RELACIONADOS
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <DocumentLink label="Historial Académico" url={solicitud.historial_academico} />
                                        <DocumentLink label="Carta de Compromiso" url={solicitud.carta_de_compromiso} />
                                        <DocumentLink label="Constancia de Matrícula" url={solicitud.constancia_matricula} />
                                        <DocumentLink label="Constancia de Tercio" url={solicitud.contancia_tercio} />
                                        <DocumentLink label="Declaración Jurada" url={solicitud.declaracion_jurada} />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="gestion" className="border rounded-xl px-4 bg-background/40 hover:bg-background/60 transition-colors shadow-sm">
                            <AccordionTrigger className="hover:no-underline font-bold text-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-data-[state=open]:rotate-3 transition-transform">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    Gestión y Observaciones
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-6 space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="observations" className="text-sm font-bold flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Observaciones de la Solicitud
                                    </Label>
                                    <Textarea
                                        id="observations"
                                        placeholder="Ingrese observaciones sobre esta solicitud..."
                                        className="min-h-[150px] bg-background/50 border-border/60 focus:border-primary/50 transition-all resize-none shadow-inner p-4"
                                        value={observations}
                                        onChange={(e) => setObservations(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <Button 
                                            onClick={handleSaveObservations} 
                                            disabled={isSaving}
                                            className="font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                                        >
                                            {isSaving ? (
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            Guardar Observaciones
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border/50">
                                    <Label className="text-sm font-bold block mb-4">ACCIONES DE ESTADO</Label>
                                    <div className="flex flex-wrap gap-3">
                                        <Button 
                                            variant="outline" 
                                            size="lg" 
                                            className="flex-1 border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-600 font-bold gap-2"
                                            onClick={() => handleUpdateStatus("PENDIENTE")}
                                            disabled={isUpdatingStatus || solicitud.estado === "PENDIENTE"}
                                        >
                                            <Clock className="w-5 h-5" />
                                            PENDIENTE
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="lg" 
                                            className="flex-1 border-green-500/50 hover:bg-green-500/10 text-green-600 font-bold gap-2"
                                            onClick={() => handleUpdateStatus("APROBADO")}
                                            disabled={isUpdatingStatus || solicitud.estado === "APROBADO"}
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            APROBAR
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="lg" 
                                            className="flex-1 border-red-500/50 hover:bg-red-500/10 text-red-600 font-bold gap-2"
                                            onClick={() => handleUpdateStatus("RECHAZADO")}
                                            disabled={isUpdatingStatus || solicitud.estado === "RECHAZADO"}
                                        >
                                            <XCircle className="w-5 h-5" />
                                            RECHAZAR
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border/50 flex justify-center">
                                    <Button 
                                        variant="link" 
                                        onClick={() => router.push("/solicitudes/becas")}
                                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Regresar al listado
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
