import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export default function SaveButton<T extends FieldValues>({ form, formId }: { form: UseFormReturn<T>, formId?: string }) {
    return (
        <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                </>
            ) : (
                <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                </>
            )}
        </Button>
    )
}