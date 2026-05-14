'use client'

import React from "react"
import EncuestaService from "@/modules/seguimiento-docente/encuestas/services/encuesta.service"
import CsvImporter from "@/components/shared/csv-importer"
import { FileSpreadsheet } from "lucide-react"

export default function ImportarEncuesta() {
    return (
        <CsvImporter
            onUpload={(file) => EncuestaService.uploadCSV(file)}
            title="Arrastre su archivo CSV de Encuestas aquí"
            successIcon={<FileSpreadsheet className="h-8 w-8 text-green-500" />}
        />
    )
}