'use client'

import React from "react"
import EncuestaService from "@/modules/perfil-docente/encuestas/services/encuesta.service"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ImportarEncuesta() {
    const [file, setFile] = React.useState<File | null>(null)
    const [uploading, setUploading] = React.useState(false)
    const [uploadProgress, setUploadProgress] = React.useState(0)
    const [uploadResult, setUploadResult] = React.useState<{ success: boolean; message: string; recordsProcessed?: number } | null>(null)
    const [dragActive, setDragActive] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0])
        }
    }
    const handleFileSelection = (selectedFile: File) => {
        // Validate file type
        if (!selectedFile.name.endsWith('.csv')) {
            toast.error("Por favor seleccione un archivo CSV válido")
            return
        }

        // Validate file size (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.error("El archivo es demasiado grande. Tamaño máximo: 10MB")
            return
        }

        setFile(selectedFile)
        setUploadResult(null)
    }
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0])
        }
    }
    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        setUploadProgress(0)
        setUploadResult(null)

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 200)

            const result = await EncuestaService.uploadCSV(file)

            clearInterval(progressInterval)
            setUploadProgress(100)

            setUploadResult({
                success: true,
                message: result.message || "Archivo cargado exitosamente",
                recordsProcessed: result.recordsProcessed
            })

            toast.success(`Se procesaron ${result.recordsProcessed} registros correctamente`)

            // Reset after success
            setTimeout(() => {
                setFile(null)
                setUploadProgress(0)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }, 3000)

        } catch (error) {
            setUploadProgress(0)
            const errorMessage = error instanceof Error ? error.message : "Error al cargar el archivo"
            setUploadResult({
                success: false,
                message: errorMessage
            })

            toast.error(errorMessage)
        } finally {
            setUploading(false)
        }
    }

    const handleReset = () => {
        setFile(null)
        setUploadProgress(0)
        setUploadResult(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <React.Fragment>
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={uploading}
                />

                {!file ? (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-primary/10 p-4 rounded-full">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-medium mb-1">
                                Arrastre su archivo CSV aquí
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">
                                o haga clic para seleccionar un archivo
                            </p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                            >
                                Seleccionar Archivo
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tamaño máximo: 10MB • Formato: CSV
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-green-500/10 p-4 rounded-full">
                                <FileSpreadsheet className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        {!uploading && !uploadResult && (
                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleUpload}>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Cargar Archivo
                                </Button>
                                <Button onClick={handleReset} variant="outline">
                                    Cancelar
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {uploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cargando archivo...</span>
                        <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}

            {/* Upload Result */}
            {uploadResult && (
                <Alert variant={uploadResult.success ? "default" : "destructive"}>
                    <div className="flex items-start gap-3">
                        {uploadResult.success ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                            <XCircle className="h-5 w-5 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <AlertDescription>
                                <p className="font-medium mb-1">
                                    {uploadResult.success ? "Carga Exitosa" : "Error en la Carga"}
                                </p>
                                <p className="text-sm">{uploadResult.message}</p>
                                {uploadResult.recordsProcessed !== undefined && (
                                    <p className="text-sm mt-1">
                                        Registros procesados: <strong>{uploadResult.recordsProcessed}</strong>
                                    </p>
                                )}
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            )}
        </React.Fragment>
    )
}