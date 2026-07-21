"use client"

import { BadgeCheck, Loader2, Undo2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { IPagoBanco } from "../pago-banco.interface"

interface PagoVerificationDialogProps {
    pago: IPagoBanco | null
    loading: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
})

export function PagoVerificationDialog({
    pago,
    loading,
    onOpenChange,
    onConfirm,
}: PagoVerificationDialogProps) {
    const willVerify = pago ? !pago.verificado : true
    const amount = pago?.monto === null || pago?.monto === undefined
        ? "-"
        : currencyFormatter.format(Number(pago.monto))

    return (
        <AlertDialog open={Boolean(pago)} onOpenChange={(open) => !loading && onOpenChange(open)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia className={willVerify ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                        {willVerify ? <BadgeCheck /> : <Undo2 />}
                    </AlertDialogMedia>
                    <AlertDialogTitle>
                        {willVerify ? "Verificar pago bancario" : "Revertir verificacion"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {willVerify
                            ? "Confirme que desea marcar este registro bancario como verificado."
                            : "Confirme que desea devolver este registro al estado pendiente."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {pago ? (
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md border bg-muted/30 p-4 text-sm">
                        <dt className="text-muted-foreground">Voucher</dt>
                        <dd className="font-mono font-medium">{pago.numeroVoucher || "-"}</dd>
                        <dt className="text-muted-foreground">Alumno</dt>
                        <dd className="font-medium">{pago.alumno || "Sin identificar"}</dd>
                        <dt className="text-muted-foreground">Monto</dt>
                        <dd className="font-semibold">{amount}</dd>
                    </dl>
                ) : null}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault()
                            onConfirm()
                        }}
                        disabled={loading}
                        className={willVerify
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-amber-600 text-white hover:bg-amber-700"}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : willVerify ? <BadgeCheck /> : <Undo2 />}
                        {loading ? "Procesando..." : willVerify ? "Verificar" : "Revertir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
