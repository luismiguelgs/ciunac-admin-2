import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export default function SaveButton({ 
    form, 
    formId, 
    disabled = false 
}: { 
    form: UseFormReturn<any, any, any>, 
    formId?: string, 
    disabled?: boolean 
}) {
    return (
        <Button type="submit" form={formId} disabled={form.formState.isSubmitting || disabled}>
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