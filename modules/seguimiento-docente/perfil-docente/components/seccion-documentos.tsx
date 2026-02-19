import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Item,
    ItemMedia,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
    ItemGroup,
    ItemFooter,
} from "@/components/ui/item"
import {
    GraduationCapIcon,
    AwardIcon,
    BookOpenIcon,
    BriefcaseIcon,
    PencilIcon,
    ExternalLinkIcon,
    CalendarIcon,
    ClockIcon,
    BuildingIcon,
    StarIcon,
    PlusIcon,
    type LucideIcon,
} from "lucide-react"
import IDocumentosPerfil from "../interfaces/documentos-perfil.interface"
import DocumentosVacio from "./documentos-vacio"

type SeccionTipo = "grados" | "diplomas" | "capacitaciones" | "experiencia"

const seccionConfig: Record<SeccionTipo, { titulo: string; icon: LucideIcon }> = {
    grados: { titulo: "Grados Académicos", icon: GraduationCapIcon },
    diplomas: { titulo: "Diplomas y Certificaciones", icon: AwardIcon },
    capacitaciones: { titulo: "Capacitaciones y Cursos", icon: BookOpenIcon },
    experiencia: { titulo: "Experiencia Profesional", icon: BriefcaseIcon },
}

function getEstadoVariant(nombre?: string): "default" | "secondary" | "destructive" | "outline" {
    switch (nombre?.toUpperCase()) {
        case "VALIDADO":
            return "default"
        case "PENDIENTE":
            return "secondary"
        case "RECHAZADO":
            return "destructive"
        default:
            return "outline"
    }
}

function formatFecha(fecha?: string): string {
    if (!fecha) return ""
    try {
        return new Date(fecha).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    } catch {
        return fecha
    }
}

interface SeccionDocumentosProps {
    tipo: SeccionTipo
    documentos: IDocumentosPerfil[]
    onEditar?: (documento: IDocumentosPerfil) => void
    onNuevo?: () => void
}

export default function SeccionDocumentos({ tipo, documentos, onEditar, onNuevo }: SeccionDocumentosProps) {
    const config = seccionConfig[tipo]
    const Icon = config.icon
    const esCapacitacion = tipo === "capacitaciones"
    const esExperiencia = tipo === "experiencia"

    if (documentos.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg w-full">
                        <Icon className="h-5 w-5" />
                        {config.titulo}
                        <Button variant="outline" size="icon" className="ml-auto" onClick={onNuevo}>
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DocumentosVacio onNuevo={onNuevo} />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg w-full">
                    <Icon className="h-5 w-5" />
                    {config.titulo}
                    <div className="ml-auto flex items-center gap-2">
                        <Badge variant="outline">{documentos.length}</Badge>
                        <Button variant="outline" size="icon" onClick={onNuevo}>
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ItemGroup>
                    {documentos.map((doc) => (
                        <div key={doc.id}>
                            <Item variant="outline" className="mb-2">
                                <ItemMedia variant="icon">
                                    <Icon className="h-4 w-4" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>{doc.tipoDocumentoPerfil?.nombre}</ItemTitle>
                                    <ItemDescription>{doc.descripcion}</ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEditar?.(doc)}
                                        title="Editar documento"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                </ItemActions>
                                <ItemFooter>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                        {/* Estado */}
                                        <Badge variant={getEstadoVariant(doc.estado?.nombre)}>
                                            {doc.estado?.nombre ?? "Sin estado"}
                                        </Badge>

                                        {/* Puntaje */}
                                        <span className="flex items-center gap-1">
                                            <StarIcon className="h-3.5 w-3.5" />
                                            {doc.puntaje} pts
                                        </span>

                                        {/* Fecha */}
                                        {doc.fechaEmision && (
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="h-3.5 w-3.5" />
                                                {formatFecha(doc.fechaEmision)}
                                            </span>
                                        )}

                                        {/* URL */}
                                        {doc.urlArchivo && (
                                            <a
                                                href={doc.urlArchivo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-primary hover:underline"
                                            >
                                                <ExternalLinkIcon className="h-3.5 w-3.5" />
                                                Ver archivo
                                            </a>
                                        )}

                                        {/* Capacitaciones: horas + institución */}
                                        {esCapacitacion && doc.horasCapacitacion > 0 && (
                                            <span className="flex items-center gap-1">
                                                <ClockIcon className="h-3.5 w-3.5" />
                                                {doc.horasCapacitacion} horas
                                            </span>
                                        )}
                                        {esCapacitacion && doc.institucionEmisora && (
                                            <span className="flex items-center gap-1">
                                                <BuildingIcon className="h-3.5 w-3.5" />
                                                {doc.institucionEmisora}
                                            </span>
                                        )}

                                        {/* Experiencia: años */}
                                        {esExperiencia && doc.experienciaLaboral > 0 && (
                                            <span className="flex items-center gap-1">
                                                <BriefcaseIcon className="h-3.5 w-3.5" />
                                                {(doc.experienciaLaboral / 12).toFixed(2)} años exp.
                                            </span>
                                        )}
                                    </div>
                                </ItemFooter>
                            </Item>
                        </div>
                    ))}
                </ItemGroup>
            </CardContent>
        </Card>
    )
}

export { type SeccionTipo, seccionConfig }
