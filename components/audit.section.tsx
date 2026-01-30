import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AuditSectionProps {
    creadoEn: Date | undefined
    modificadoEn: Date | undefined
}

export const AuditSection = ({ creadoEn, modificadoEn }: AuditSectionProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <div className="flex flex-col gap-1">
                <span className="font-medium">Creado el:</span>
                <span>
                    {creadoEn ? format(new Date(creadoEn), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es }) : '-'}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="font-medium">Última modificación:</span>
                <span>
                    {modificadoEn ? format(new Date(modificadoEn), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es }) : '-'}
                </span>
            </div>
        </div>
    )
}