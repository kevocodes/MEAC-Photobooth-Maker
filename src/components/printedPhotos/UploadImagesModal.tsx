import { Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import FileUpload from "../common/FileUpload";
import { useState } from "react";
import { uploadPhotos } from "@/services/photos.service";
import { ResponseError } from "@/models/ResponseError";
import { toast } from "sonner";

interface UploadImagesModalProps {
  doRefetch: () => void;
}

function UploadImagesModal({ doRefetch }: UploadImagesModalProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onSubmitPhotos = async (files: File[]) => {
    try {
      setLoading(true);
      await uploadPhotos(files);
      setOpen(false);
      toast.success("Fotos subidas correctamente");
      doRefetch();
    } catch (error) {
      if (error instanceof ResponseError) return toast.error(error.message);
      toast.error("Error subiendo las fotos");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-6 h-6 text-primary" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Subir imágenes</AlertDialogTitle>
        </AlertDialogHeader>

        <FileUpload
          uploadMode="multi"
          acceptedFileTypes={{
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
          }}
          defaultText="Arrastra y suelta las fotografías aquí"
          otherText="o haz clic para seleccionarlas"
          loading={loading}
          actionText="Subir"
          previewsNumber={2}
          onSubmitFiles={onSubmitPhotos}
        />

        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UploadImagesModal;
