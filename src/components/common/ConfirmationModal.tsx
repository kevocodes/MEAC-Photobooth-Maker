import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ResponseError } from "@/models/ResponseError";

interface ConfirmationModalProps {
  title: string;
  description: string;
  cancelText?: string;
  acceptText?: string;
  triggerClassName?: string;
  children: React.ReactNode;
  onAccept: () => void;
}

function ConfirmationModal({
  title,
  description,
  cancelText = "Cancelar",
  acceptText = "Aceptar",
  children,
  onAccept,
}: ConfirmationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await onAccept();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof ResponseError) return toast.error(error.message);
      toast.error("Ocurrió un error al realizar la acción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <Button disabled={loading} onClick={handleAccept}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            {acceptText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationModal;
