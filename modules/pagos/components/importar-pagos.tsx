"use client"

import { CreditCard, DollarSign } from "lucide-react"
import CsvImporter from "@/components/shared/csv-importer"
import { PagosBancoService } from "../pagos-banco.service"

export default function ImportarPagos() {
    return (
        <CsvImporter
            onUpload={async (file) => {
                const result = await PagosBancoService.uploadPagosCSV(file)
                return {
                    success: true,
                    message: result.message,
                }
            }}
            title="Arrastre su archivo CSV de pagos aqui"
            subtitle="o haga clic para seleccionar un archivo bancario"
            defaultIcon={<CreditCard className="h-8 w-8 text-primary" />}
            successIcon={<DollarSign className="h-8 w-8 text-green-500" />}
        />
    )
}
