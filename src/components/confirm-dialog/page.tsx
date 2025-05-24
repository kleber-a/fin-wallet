import { ConfirmDialogProps } from "@/types";

export default function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  loading = false,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 space-y-4 w-[90%] max-w-md">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-700">{description}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition cursor-pointer"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ${
              loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? "Processando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
