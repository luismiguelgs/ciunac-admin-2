import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ href }: { href: string }) {
    return (
        <Button variant="outline" asChild>
            <Link href={href}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regresar
            </Link>
        </Button>
    )
}