"use client"
import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, AlertCircle, Download } from "lucide-react"
import ImportarPagos from "@/modules/solicitudes/pagos/components/importar-pagos"
import ProtectedRoute from "@/components/protected-route"

export default function ImportarPagosPage() {
    return (
        <ProtectedRoute>
            <React.Fragment>
                <NavigationBread section="Solicitudes" href="/solicitudes" page="Importar Pagos" />
                <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Importar Pagos de Banco
                            </CardTitle>
                            <CardDescription>
                                Cargue un archivo CSV con los reportes de pagos. El archivo será enviado al servidor para su conciliación.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ImportarPagos />
                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Instrucciones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p>El archivo CSV debe cumplir con los siguientes requisitos:</p>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                                        <li>El formato del archivo debe ser <strong>.csv</strong>.</li>
                                        <li>El tamaño máximo permitido es de <strong>10MB</strong>.</li>
                                        <li>Asegúrese de que el formato de columnas sea el emitido por el sistema bancario.</li>
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
        </ProtectedRoute>
    )
}
