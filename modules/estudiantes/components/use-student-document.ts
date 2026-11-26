"use client"

import { useRef, useState } from "react"
import { studentApi } from "../estudiantes.client"
import { getStudentDocumentError } from "./student-fields"

export function useStudentDocument() {
    const cached = useRef<{ file: File; link: string } | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File>()

    async function upload(file: File | undefined) {
        if (!file) return undefined
        const error = getStudentDocumentError(file)
        if (error) throw new Error(error)
        if (cached.current?.file === file) return cached.current.link
        setUploading(true)
        try {
            const data = new FormData()
            data.set("file", file)
            const { viewLink } = await studentApi<{ viewLink: string }>("/documento", { method: "POST", body: data })
            cached.current = { file, link: viewLink }
            setUploadedFile(file)
            return viewLink
        } finally {
            setUploading(false)
        }
    }

    return { upload, uploading, uploadedFile }
}
