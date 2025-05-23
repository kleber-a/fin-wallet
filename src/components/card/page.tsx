import { Cards } from "@/types";


export default function Card({ icon, title, description }: Cards) {
    return (
        <div className="flex flex-col items-center space-y-3 rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-all">
            <div className="rounded-full bg-green-100 p-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-center text-gray-500">
                {description}
            </p>
        </div>
    )
}