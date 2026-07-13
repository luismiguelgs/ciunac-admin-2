'use client'

import type { ComponentProps } from "react"
import { SolicitudDetails } from "../shared/solicitud-details"

type SolicitudCertificadosDetailsProps = Omit<
    ComponentProps<typeof SolicitudDetails>,
    "backHref" | "showCertificateAttachment" | "tipoGroup"
>

export function SolicitudCertificadosDetails(props: SolicitudCertificadosDetailsProps) {
    return (
        <SolicitudDetails
            {...props}
            backHref="/solicitudes/certificados"
            tipoGroup="certificados"
            showCertificateAttachment
        />
    )
}
