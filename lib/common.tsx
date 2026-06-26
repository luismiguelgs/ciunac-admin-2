import React from "react"

type FlagProps = {
    title: string
}

const flagClassName = "h-5 w-7 overflow-hidden rounded-sm border shadow-sm"

function FrenchFlag({ title }: FlagProps) {
    return (
        <svg className={flagClassName} viewBox="0 0 28 20" role="img" aria-label={title}>
            <rect width="28" height="20" fill="#fff" />
            <rect width="9.33" height="20" fill="#092050" />
            <rect x="18.67" width="9.33" height="20" fill="#be2a2c" />
        </svg>
    )
}

function PortugueseFlag({ title }: FlagProps) {
    return (
        <svg className={flagClassName} viewBox="0 0 28 20" role="img" aria-label={title}>
            <rect width="28" height="20" fill="#459a45" />
            <polygon points="14,3 25,10 14,17 3,10" fill="#fedf00" />
            <circle cx="14" cy="10" r="4" fill="#0a2172" />
        </svg>
    )
}

function EnglishFlag({ title }: FlagProps) {
    return (
        <svg className={flagClassName} viewBox="0 0 28 20" role="img" aria-label={title}>
            <rect width="28" height="20" fill="#fff" />
            {Array.from({ length: 4 }).map((_, index) => (
                <rect key={index} y={index * 5} width="28" height="2.2" fill="#a62842" />
            ))}
            <rect width="12" height="10.8" fill="#102d5e" />
            <circle cx="3" cy="3" r="0.6" fill="#fff" />
            <circle cx="6" cy="3" r="0.6" fill="#fff" />
            <circle cx="9" cy="3" r="0.6" fill="#fff" />
            <circle cx="4.5" cy="6" r="0.6" fill="#fff" />
            <circle cx="7.5" cy="6" r="0.6" fill="#fff" />
            <circle cx="10.5" cy="6" r="0.6" fill="#fff" />
            <circle cx="3" cy="9" r="0.6" fill="#fff" />
            <circle cx="6" cy="9" r="0.6" fill="#fff" />
            <circle cx="9" cy="9" r="0.6" fill="#fff" />
        </svg>
    )
}

function ItalianFlag({ title }: FlagProps) {
    return (
        <svg className={flagClassName} viewBox="0 0 28 20" role="img" aria-label={title}>
            <rect width="28" height="20" fill="#fff" />
            <rect width="9.33" height="20" fill="#41914d" />
            <rect x="18.67" width="9.33" height="20" fill="#bf393b" />
        </svg>
    )
}

function ChineseFlag({ title }: FlagProps) {
    return (
        <svg className={flagClassName} viewBox="0 0 28 20" role="img" aria-label={title}>
            <rect width="28" height="20" fill="#db362f" />
            <polygon points="6,3 6.8,5.2 9.1,5.2 7.2,6.6 7.9,8.8 6,7.4 4.1,8.8 4.8,6.6 2.9,5.2 5.2,5.2" fill="#ff0" />
            <circle cx="12" cy="4" r="0.8" fill="#ff0" />
            <circle cx="14.5" cy="7" r="0.8" fill="#ff0" />
            <circle cx="14.2" cy="11" r="0.8" fill="#ff0" />
            <circle cx="11.5" cy="14" r="0.8" fill="#ff0" />
        </svg>
    )
}

function DefaultFlag({ title }: FlagProps) {
    return (
        <svg className={flagClassName} viewBox="0 0 28 20" role="img" aria-label={title}>
            <rect width="28" height="20" fill="#e5e7eb" />
            <rect width="28" height="6.66" fill="#60a5fa" />
            <rect y="13.34" width="28" height="6.66" fill="#34d399" />
        </svg>
    )
}

export function getItemByCode(code: number | string | null | undefined, title = "Idioma") {
    const numericCode = Number(code)

    const icons: Record<number, React.ReactElement> = {
        1: <FrenchFlag title={title} />,
        2: <PortugueseFlag title={title} />,
        3: <EnglishFlag title={title} />,
        4: <ItalianFlag title={title} />,
        6: <ChineseFlag title={title} />,
    }

    return icons[numericCode] || <DefaultFlag title={title} />
}
