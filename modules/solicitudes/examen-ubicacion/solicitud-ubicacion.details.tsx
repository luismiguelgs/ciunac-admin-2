'use client'

import type { ComponentProps } from "react"
import { SolicitudDetails } from "../shared/solicitud-details"

type SolicitudUbicacionDetailsProps = Omit<ComponentProps<typeof SolicitudDetails>, "backHref" | "tipoGroup">

export function SolicitudUbicacionDetails(props: SolicitudUbicacionDetailsProps) {
    return (
        <SolicitudDetails
            {...props}
            backHref="/solicitudes/ubicacion"
            tipoGroup="ubicacion"
        />
    )
}
