'use client'

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ISolicitud } from "../shared/solicitud.interface"
import { IIdioma, INivel, ITipoSolicitud } from "@/modules/estructura/interfaces/types.interface"
import SolicitudesService from "../shared/solicitudes.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/forms/input.field"
import { SelectField } from "@/components/forms/select.field"
import { DatePicker } from "@/components/forms/date-picker.field"
import {
    CreditCard,
    Image as ImageIcon,
    ExternalLink,
    Loader2,
    GraduationCap,
    Layers,
    Phone,
    IdCard,
    CheckCircle2,
    Clock,
    Info,
    Calendar,
    History
} from "lucide-react"
import { cn, getGoogleDriveDirectLink } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { Pencil, X } from "lucide-react"
import SaveButton from "@/components/save.button"
import BackButton from "@/components/back.button"

const formSchema = z.object({
    tipoSolicitudId: z.string().min(1, "Tipo de solicitud es requerido"),
    estadoId: z.string().min(1, "Estado es requerido"),
    idiomaId: z.string().min(1, "Idioma es requerido"),
    nivelId: z.string().min(1, "Nivel es requerido"),
    numeroVoucher: z.string().min(1, "El número de voucher es requerido"),
    pago: z.coerce.number().min(0, "El monto debe ser mayor o igual a 0"),
    fechaPago: z.coerce.date().refine((date) => !isNaN(date.getTime()), "La fecha de pago es requerida"),
})

interface SolicitudConstanciasDetailsProps {
    solicitud: ISolicitud
    tiposSolicitud: ITipoSolicitud[]
    idiomas: IIdioma[]
    niveles: INivel[]
    estados: { id: number, nombre: string }[]
}

export function SolicitudConstanciasDetails({
    solicitud,
    tiposSolicitud,
    idiomas,
    niveles,
    estados
}: SolicitudConstanciasDetailsProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipoSolicitudId: solicitud.tipoSolicitudId ? String(solicitud.tipoSolicitudId) : "",
            estadoId: solicitud.estadoId ? String(solicitud.estadoId) : "",
            idiomaId: solicitud.idiomaId ? String(solicitud.idiomaId) : "",
            nivelId: solicitud.nivelId ? String(solicitud.nivelId) : "",
            numeroVoucher: solicitud.numeroVoucher || "",
            pago: solicitud.pago || 0,
            fechaPago: (solicitud.fechaPago && !isNaN(new Date(solicitud.fechaPago).getTime()))
                ? new Date(solicitud.fechaPago)
                : undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true)
        // Convert string IDs back to numbers for the API
        const dataToSave = {
            ...values,
            tipoSolicitudId: Number(values.tipoSolicitudId),
            estadoId: Number(values.estadoId),
            idiomaId: Number(values.idiomaId),
            nivelId: Number(values.nivelId),
            fechaPago: values.fechaPago instanceof Date && !isNaN(values.fechaPago.getTime())
                ? values.fechaPago.toISOString().split('T')[0]
                : null
        }

        const success = await SolicitudesService.update(solicitud.id, dataToSave as any)
        if (success) {
            toast.success("Solicitud actualizada correctamente")
            setIsEditing(false)
            router.refresh()
        } else {
            toast.error("Error al actualizar la solicitud")
        }
        setIsSaving(false)
    }


    const tipoOptions = tiposSolicitud.map(t => ({ label: t.solicitud, value: String(t.id) }))
    const idiomaOptions = idiomas.map(i => ({ label: i.nombre, value: String(i.id) }))
    const nivelOptions = niveles.map(n => ({ label: n.nombre, value: String(n.id) }))
    const estadoOptions = estados.map(e => ({ label: e.nombre, value: String(e.id) }))

    const getStatusConfig = (id: number) => {
        const config: Record<number, { label: string, color: string, icon: React.ReactNode }> = {
            1: { label: "Nuevas", color: "bg-blue-500/10 text-blue-600 border-blue-200/50", icon: <Clock className="w-3.5 h-3.5" /> },
            2: { label: "Procesadas", color: "bg-orange-500/10 text-orange-600 border-orange-200/50", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
            4: { label: "Pagadas", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200/50", icon: <CreditCard className="w-3.5 h-3.5" /> },
            3: { label: "Finalizadas", color: "bg-green-500/10 text-green-600 border-green-200/50", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        }
        return config[id] || { label: "Desconocido", color: "bg-muted text-muted-foreground", icon: <Info className="w-3.5 h-3.5" /> }
    }

    const currentStatus = getStatusConfig(solicitud.estadoId)

    return (
        <TooltipProvider>
            <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <BackButton href="/solicitudes/constancias" />

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn("gap-1.5 py-1 px-3 font-semibold shadow-sm", currentStatus.color)}>
                            {currentStatus.icon}
                            {currentStatus.label}
                        </Badge>
                    </div>
                </div>

                {/* Hero Profile Header */}
                <Card className="border-none bg-gradient-to-br from-primary/5 via-transparent to-primary/5 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-1 ring-primary/10">
                                    <AvatarImage src={solicitud.estudiante?.imgDoc || ""} alt={solicitud.estudiante?.nombres} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                        {solicitud.estudiante?.nombres?.charAt(0)}{solicitud.estudiante?.apellidos?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 p-1.5 bg-background rounded-full shadow-lg border border-border">
                                    <div className={cn("h-3 w-3 rounded-full", solicitud.estadoId === 3 ? "bg-green-500" : "bg-blue-500")} />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        {solicitud.estudiante?.nombres} {solicitud.estudiante?.apellidos}
                                    </h1>
                                    <Badge variant="secondary" className="w-fit self-center md:self-auto font-mono text-xs">
                                        ID #{solicitud.id}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <IdCard className="w-4 h-4 text-primary/60" />
                                        <span className="font-medium text-foreground/80">{solicitud.estudiante?.numeroDocumento}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-primary/60" />
                                        <span className="font-medium text-foreground/80">{solicitud.estudiante?.codigo}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="w-4 h-4 text-primary/60" />
                                        <span className="font-medium text-foreground/80">{solicitud.estudiante?.celular}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col items-end gap-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Periodo Académico</span>
                                <div className="text-xl font-black text-primary/80">{solicitud.periodo}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Main Configuration Card */}
                        <Card className="shadow-md border-primary/5">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl flex items-center gap-2.5">
                                    <Layers className="w-5 h-5 text-primary" />
                                    Configuración de la Solicitud
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <SelectField
                                        control={form.control}
                                        name="tipoSolicitudId"
                                        label="Tipo de Solicitud"
                                        options={tipoOptions}
                                        disabled={!isEditing}
                                    />
                                    <SelectField
                                        control={form.control}
                                        name="estadoId"
                                        label="Estado de Proceso"
                                        options={estadoOptions}
                                        disabled={!isEditing}
                                    />
                                    <SelectField
                                        control={form.control}
                                        name="idiomaId"
                                        label="Idioma"
                                        options={idiomaOptions}
                                        disabled={!isEditing}
                                    />
                                    <SelectField
                                        control={form.control}
                                        name="nivelId"
                                        label="Nivel / Grado"
                                        options={nivelOptions}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <Separator className="opacity-50" />

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wide">
                                        <CreditCard className="w-4 h-4 text-primary" />
                                        Información de Pago
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <InputField
                                            control={form.control}
                                            name="numeroVoucher"
                                            label="N° de Voucher"
                                            placeholder="000-0000"
                                            disabled={!isEditing}
                                        />
                                        <InputField
                                            control={form.control}
                                            name="pago"
                                            label="Monto (S/)"
                                            type="number"
                                            placeholder="0.00"
                                            disabled={!isEditing}
                                        />
                                        <DatePicker
                                            control={form.control}
                                            name="fechaPago"
                                            label="Fecha de Pago"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 border-t flex justify-between p-6">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Info className="w-3.5 h-3.5" />
                                    {isEditing ? "Modo edición activo. Guarde los cambios para finalizar." : "Modo lectura. Haga clic en 'Editar Información' para modificar."}
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant={isEditing ? "ghost" : "outline"}
                                        onClick={() => {
                                            if (isEditing) {
                                                form.reset()
                                                setIsEditing(false)
                                            } else {
                                                setIsEditing(true)
                                            }
                                        }}
                                        className="gap-2 px-6"
                                    >
                                        {isEditing ? (
                                            <>
                                                <X className="w-4 h-4" />
                                                Cancelar
                                            </>
                                        ) : (
                                            <>
                                                <Pencil className="w-4 h-4" />
                                                Editar
                                            </>
                                        )}
                                    </Button>
                                    <SaveButton form={form} disabled={!isEditing} />
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Audit & Stats Card - Integrated at the bottom of the form */}
                        <Card className="shadow-sm border-primary/5 bg-primary/5 border-none">
                            <CardHeader className="pb-3 pt-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary/70">
                                    <History className="w-3.5 h-3.5" />
                                    Trazabilidad de la Solicitud
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Fecha de Creación</p>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                            <p className="text-xs font-semibold">
                                                {solicitud.creadoEn ? new Date(solicitud.creadoEn).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Última Modificación</p>
                                        <div className="flex items-center gap-1.5">
                                            <History className="w-3.5 h-3.5 text-purple-500" />
                                            <p className="text-xs font-semibold">
                                                {solicitud.modificadoEn ? new Date(solicitud.modificadoEn).toLocaleString('es-PE') : "Sin cambios"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Monto Registrado</p>
                                        <div className="flex items-center gap-1.5">
                                            <CreditCard className="w-3.5 h-3.5 text-green-600" />
                                            <p className="text-xs font-black text-foreground">S/ {Number(solicitud.pago).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Tipo de Alumno</p>
                                        <div className="flex items-center gap-1.5 pt-0.5">
                                            <Badge variant="outline" className="text-[10px] uppercase font-black py-0 h-5 bg-background border-primary/20">
                                                {solicitud.alumnoCiunac ? "Interno" : "Externo"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Side Cards Container */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Voucher Visualization */}
                        {solicitud.imgVoucher ? (
                            <Card className="overflow-hidden border-none shadow-md group">
                                <CardHeader className="bg-muted/50 py-3">
                                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-primary" />
                                            Voucher Digital
                                        </div>
                                        <div className="flex gap-1">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            window.open(solicitud.imgVoucher, "_blank");
                                                        }}
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Abrir original</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 bg-muted/20">
                                    <div className="relative rounded-lg border border-border shadow-inner bg-background overflow-hidden min-h-[450px] flex items-center justify-center group-hover:border-primary/30 transition-colors">
                                        {solicitud.imgVoucher.includes("drive.google.com") ? (
                                            <div className="w-full h-[450px] relative bg-muted/5">
                                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 animate-pulse">
                                                    <Loader2 className="w-8 h-8 animate-spin" />
                                                </div>
                                                <iframe
                                                    src={solicitud.imgVoucher.split('?')[0].replace("/view", "/preview").replace("/edit", "/preview")}
                                                    className="w-full h-full border-none relative z-10"
                                                    allow="autoplay"
                                                    title="Visor de Voucher"
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={getGoogleDriveDirectLink(solicitud.imgVoucher)}
                                                alt="Voucher"
                                                className="max-w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = target.nextElementSibling as HTMLElement;
                                                    if (fallback) fallback.style.display = 'flex';
                                                }}
                                            />
                                        )}

                                        <div className="hidden absolute inset-0 flex-col items-center justify-center p-6 text-center space-y-3 bg-muted/10">
                                            <div className="p-3 rounded-full bg-background border shadow-sm text-muted-foreground">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Vista previa no disponible</p>
                                                <p className="text-[10px] text-muted-foreground/60 px-4">
                                                    No se pudo cargar la vista previa. El archivo puede ser privado o el formato no es compatible.
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-[10px] font-bold uppercase tracking-wider"
                                                onClick={() => window.open(solicitud.imgVoucher, "_blank")}
                                            >
                                                Ver en Google Drive
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-[10px] text-center text-muted-foreground font-medium">
                                        Use los controles del visor o el icono superior para ver en detalle
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed shadow-none bg-muted/5">
                                <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-2">
                                    <div className="p-3 rounded-full bg-muted text-muted-foreground/40">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-muted-foreground">Sin Voucher</p>
                                        <p className="text-xs text-muted-foreground/60">Esta solicitud no tiene una imagen de voucher adjunta.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </form>
            </div>
        </TooltipProvider>
    )
}
