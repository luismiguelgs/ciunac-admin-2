'use client'

import type { ComponentProps } from "react"
import { SolicitudConstanciasDetails } from "../constancias/solicitud-constancias.details"

type SolicitudUbicacionDetailsProps = Omit<ComponentProps<typeof SolicitudConstanciasDetails>, "backHref">

export function SolicitudUbicacionDetails(props: SolicitudUbicacionDetailsProps) {
    return (
        <SolicitudConstanciasDetails
            {...props}
            backHref="/solicitudes/ubicacion"
        />
    )
}
