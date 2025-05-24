import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div data-testid="loader-icon" className="flex justify-center items-center h-48">
            <Loader2
                className="animate-spin text-amber-400 w-12 h-12"
                role="img"
                aria-label="Loading"
            />
        </div>
    );
}
