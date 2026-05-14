import { z } from 'zod'
import { IConstancia } from './constancias.interface'

const msgReq = 'Campo requerido'

const baseSchema = z.object({
    estudiante: z.string().min(1, msgReq),
    dni: z.string().min(1, msgReq),
    idioma: z.string().trim().min(1, msgReq),
    nivel: z.string().trim().min(1, msgReq),
    tipo: z.string().trim().min(1, msgReq),
    ciclo: z.coerce.number().min(1, msgReq),
    modalidad: z.string().trim().optional().nullable(),
    impreso: z.boolean(),
    aceptado: z.boolean(),
    id_solicitud: z.coerce.number(),
    horario: z.string().trim().optional().nullable(),
    url: z.string().trim().optional().nullable(),
})

const validationSchema = baseSchema.superRefine((data, ctx) => {
    if (data.tipo === 'MATRICULA') {
        if (!data.modalidad || data.modalidad.trim() === '') {
            ctx.addIssue({
                path: ['modalidad'],
                code: z.ZodIssueCode.custom,
                message: msgReq,
            })
        }
        if (!data.horario || data.horario.trim() === '') {
            ctx.addIssue({
                path: ['horario'],
                code: z.ZodIssueCode.custom,
                message: msgReq,
            })
        }
    }
})

type ConstanciaFormValues = z.infer<typeof baseSchema>

const initialValues: ConstanciaFormValues = {
    estudiante: '',
    idioma: '',
    impreso: false,
    modalidad: 'REGULAR',
    nivel: '',
    tipo: 'MATRICULA',
    ciclo: 0,
    dni: '',
    id_solicitud: 0,
    horario: '',
    aceptado: false,
    url: '',
}

export { initialValues, validationSchema }
export type { ConstanciaFormValues }
