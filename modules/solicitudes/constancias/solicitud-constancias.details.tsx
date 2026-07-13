'use client'

import type { ComponentProps } from "react"
import { SolicitudDetails } from "../shared/solicitud-details"

type SolicitudConstanciasDetailsProps = Omit<ComponentProps<typeof SolicitudDetails>, "backHref" | "tipoGroup">

export function SolicitudConstanciasDetails(props: SolicitudConstanciasDetailsProps) {
    return <SolicitudDetails {...props} backHref="/solicitudes/constancias" tipoGroup="constancias" />
}
