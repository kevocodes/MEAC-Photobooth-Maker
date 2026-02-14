import ConfirmationModal from "@/components/common/ConfirmationModal";
import LoaderSpinner from "@/components/common/LoaderSpinner";
import { Button } from "@/components/ui/button";
import { PublicRoutes } from "@/constants/routes";
import { Photography } from "@/models/photography.model";
import { confirmPrintedPhotos } from "@/services/photos.service";
import ImagesPrintable from "@/templates/ImagesPrintable";
import { usePDF } from "@react-pdf/renderer";
import { Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function PDFDownload() {
  const location = useLocation();
  const navigator = useNavigate();
  const state = location.state as { photographies: Photography[] } | null;
  const selectedPhotographies = state?.photographies || [];

  const [instance] = usePDF({
    document: <ImagesPrintable photos={selectedPhotographies} />,
  });

  if (!state) {
    navigator(PublicRoutes.Home);
    return null;
  }

  const handleConfirmPrinted = async () => {
    const quantityById: Record<string, { id: string; quantity: number }> = {};

    selectedPhotographies.forEach((photo) => {
      if (!quantityById[photo.id])
        quantityById[photo.id] = { id: photo.id, quantity: 0 };
      quantityById[photo.id].quantity += 1;
    });

    const items = Object.values(quantityById);
    await confirmPrintedPhotos(items);
    toast.success("Fotografías marcadas como impresas");
    navigator(PublicRoutes.LoadedPhotos, { replace: true });
  };

  return (
    <main className="min-h-[calc(100dvh-56px)] flex flex-col gap-4 justify-center items-center relative p-4">
      {instance.loading && (
        <div className="flex flex-col gap-6 items-center">
          <LoaderSpinner />
          <p className="text-center text-xl text-muted-foreground font-bold">
            Generando PDF...
          </p>
        </div>
      )}
      {!instance.loading && instance.url && (
        <>
          <h1 className="text-xl sm:text-2xl font-bold text-primary mb-6">
            Imprime las fotografías
          </h1>

          <iframe
            src={instance.url}
            className="w-full max-w-3xl h-[300px] sm:h-[600px] sm:max-h-full border-2 border-dashed border-primary-foreground"
            title="Vista previa del PDF"
          />

          <ConfirmationModal
            title="Confirmar impresión"
            description="¿Confirmas que estas fotografías ya fueron impresas?"
            acceptText="Sí, confirmar"
            onAccept={handleConfirmPrinted}
          >
            <Button className="mt-4">
              <Check className="w-4 h-4 mr-2" />
              Confirmar impresión
            </Button>
          </ConfirmationModal>
        </>
      )}
    </main>
  );
}

export default PDFDownload;
