import NavigationBread from "@/components/navigation-bread"
import { NuevaSolicitudForm } from "@/modules/solicitudes/nueva/nueva-solicitud.form"

export default function PageNuevaSolicitud() {
    return (
        <>
            <NavigationBread
                section="Solicitudes"
                href="/solicitudes"
                page="Nueva Solicitud"
            />
            <div className="container mx-auto px-4 py-4">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold">Nueva Solicitud</h1>
                    <p className="text-sm text-muted-foreground">
                        Registro manual de certificados, constancias y examenes de ubicacion.
                    </p>
                </div>
                <NuevaSolicitudForm />
            </div>
        </>
    )
}
