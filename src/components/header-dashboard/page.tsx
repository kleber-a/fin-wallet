interface DashboardHeaderProps {
    heading: string
    text?: string
    children?: React.ReactNode
}

export default function HeaderDashBoard({ heading, text, children }: DashboardHeaderProps) {

    return (
        <div className="flex items-center justify-between px-2 flex-col gap-10">
            <div className="grid gap-1">
                <h1 className="text-2xl font-bold tracking-wide">{heading}</h1>
                <p className="text-gray-500 dark:text-gray-400">{text}</p>
            </div>
            {children}
        </div>
    )
}