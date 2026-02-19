'use client'
import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, AlertCircle, Download } from "lucide-react"
import ImportarEncuesta from "@/modules/seguimiento-docente/encuestas/components/importar-encuesta"

export default function EncuestasImportarPage() {
    return (
        <React.Fragment>
            <NavigationBread section="Encuestas" href="/perfil-docente/encuestas" page="Importar" />
            <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5" />
                            Importar Respuestas de Encuestas
                        </CardTitle>
                        <CardDescription>
                            Cargue un archivo CSV con las respuestas de las encuestas. El archivo debe contener las columnas requeridas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Upload Area */}
                        <ImportarEncuesta />
                        {/* Instructions */}
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Instrucciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>El archivo CSV debe contener las siguientes columnas:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                                    <li>Estudiante</li>
                                    <li>Docente</li>
                                    <li>Número Identificación (Formato texto)</li>
                                    <li>Curso</li>
                                    <li>Asignatura</li>
                                    <li>Período</li>
                                    <li>Preguntas (1,2,...10)</li>
                                    <li>Comentario</li>
                                </ul>
                                <div className="pt-2">
                                    <Button variant="link" className="h-auto p-0 text-primary" asChild>
                                        <a href="#" className="flex items-center gap-1">
                                            <Download className="h-3 w-3" />
                                            Descargar plantilla de ejemplo
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </React.Fragment>
    )
}