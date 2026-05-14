'use client'

import React from "react"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"
import CsvImporter from "@/components/shared/csv-importer"
import { CreditCard, DollarSign } from "lucide-react"

export default function ImportarPagos() {
    return (
        <CsvImporter
            onUpload={async (file) => {
                // Wrap the call to handle the specific response type of { message: string }
                const result = await SolicitudesService.uploadPagosCSV(file);
                return {
                    success: true,
                    message: result.message
                };
            }}
            title="Arrastre su archivo CSV de Pagos aquí"
            subtitle="o haga clic para seleccionar un archivo bancario"
            defaultIcon={<CreditCard className="h-8 w-8 text-primary" />}
            successIcon={<DollarSign className="h-8 w-8 text-green-500" />}
        />
    )
}
