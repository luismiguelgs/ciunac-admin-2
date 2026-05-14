'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ListPlus, Loader2, Search } from "lucide-react"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"
import { ISolicitud } from "@/modules/solicitudes/shared/solicitud.interface"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { Calendar, CreditCard, Fingerprint, Globe, Layers, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface AsignarSolicitudButtonProps {
  onAsignar: (solicitud: ISolicitud) => void
}

export function AsignarSolicitudButton({ onAsignar }: AsignarSolicitudButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [solicitudes, setSolicitudes] = useState<ISolicitud[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (isOpen) {
      cargarSolicitudes()
      setSearchQuery("") // Reset search on open
    }
  }, [isOpen])

  const cargarSolicitudes = async () => {
    setIsLoading(true)
    try {
      // Estado 4 = Pagadas
      const response = await SolicitudesService.fetchItemByState('constancias', 4)
      setSolicitudes(response || [])
    } catch (error) {
      console.error("Error al cargar solicitudes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAsignar = async (solicitud: ISolicitud) => {
    try {
      // Cambiar estado a 12 para que salga de la lista de pagados (4)
      const success = await SolicitudesService.update(solicitud.id, { estadoId: 12 })
      
      if (success) {
        onAsignar(solicitud)
        setIsOpen(false)
      } else {
        toast.error("Error", { description: "No se pudo actualizar el estado de la solicitud." })
      }
    } catch (error) {
      console.error("Error al actualizar estado de solicitud:", error)
      toast.error("Error", { description: "Ocurrió un error inesperado." })
    }
  }

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const searchLower = searchQuery.toLowerCase()
    const fullName = `${solicitud.estudiante?.nombres || ''} ${solicitud.estudiante?.apellidos || ''}`.toLowerCase()
    const dni = solicitud.estudiante?.numeroDocumento?.toLowerCase() || ''
    const id = String(solicitud.id)

    return fullName.includes(searchLower) || dni.includes(searchLower) || id.includes(searchLower)
  })

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ListPlus className="h-4 w-4" />
          Asignar Solicitud
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col h-full">
        <SheetHeader className="mb-4 shrink-0">
          <SheetTitle>Solicitudes Pagadas</SheetTitle>
          <SheetDescription>
            Seleccione una solicitud para asignar sus datos al formulario.
          </SheetDescription>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, DNI o ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mr-4 pr-4 h-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ListPlus className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>No hay solicitudes pagadas disponibles.</p>
            </div>
          ) : filteredSolicitudes.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>No se encontraron resultados para "{searchQuery}".</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredSolicitudes.map((solicitud, index) => (
                <React.Fragment key={solicitud.id}>
                  <div
                    className="group flex flex-col gap-1.5 p-3.5 hover:bg-slate-50 cursor-pointer transition-all border-l-2 border-transparent hover:border-primary"
                    onClick={() => handleAsignar(solicitud)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-sm truncate uppercase">
                            {solicitud.estudiante?.nombres} {solicitud.estudiante?.apellidos}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Fingerprint className="h-3 w-3" />
                            <span>{solicitud.estudiante?.numeroDocumento}</span>
                            <span className="opacity-30">•</span>
                            <span className="font-mono">ID: {solicitud.id}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px] h-5 bg-background font-mono px-1.5 border-primary/20 text-primary">
                        {solicitud.tiposSolicitud?.solicitud?.toLowerCase().includes('nota') ? 'NOTAS' : 'MATRÍCULA'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(solicitud.creadoEn)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 opacity-70" />
                        <span className="truncate max-w-[100px]">{solicitud.idioma?.nombre}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3 w-3 opacity-70" />
                        <span>{solicitud.nivel?.nombre}</span>
                      </div>
                    </div>
                  </div>
                  {index < filteredSolicitudes.length - 1 && <Separator className="opacity-50" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  )
}
