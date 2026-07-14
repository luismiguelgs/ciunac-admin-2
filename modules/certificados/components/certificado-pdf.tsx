import type { DocumentProps } from "@react-pdf/renderer"
import { pdf } from "@react-pdf/renderer"
import QRCode from "qrcode"
import type { ReactElement } from "react"
import type { ICertificado } from "../certificado.interface"
import { buildCertificadoFileName, getCertificadoId, isCertificadoDigital } from "../certificados.utils"
import { CertificadoDigitalFormat } from "../formatos/certificado-digital.format"
import { CertificadoFisicoFormat } from "../formatos/certificado-fisico.format"

export function getCertificadoValidationUrl(certificado: ICertificado): string {
    return `https://ciunac.unac.edu.pe/validacion-certificado/?url=${getCertificadoId(certificado)}`
}

export async function createCertificadoDocument(certificado: ICertificado): Promise<ReactElement<DocumentProps>> {
    const validationUrl = getCertificadoValidationUrl(certificado)
    const qrCode = await QRCode.toDataURL(validationUrl)

    return isCertificadoDigital(certificado.tipo)
        ? <CertificadoDigitalFormat certificado={certificado} qrCode={qrCode} validationUrl={validationUrl} />
        : <CertificadoFisicoFormat certificado={certificado} qrCode={qrCode} />
}

export async function createCertificadoPdfFile(certificado: ICertificado): Promise<File> {
    const document = await createCertificadoDocument(certificado)
    const blob = await pdf(document).toBlob()
    return new File([blob], buildCertificadoFileName(certificado), { type: "application/pdf" })
}
