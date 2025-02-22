import LoaderSpinner from "@/components/common/LoaderSpinner";
import { PublicRoutes } from "@/constants/routes";
import ImagesPrintable from "@/templates/ImagesPrintable";
import { usePDF } from "@react-pdf/renderer";
import { useLocation, useNavigate } from "react-router-dom";

function PDFDownload() {
  const location = useLocation();
  const navigator = useNavigate();

  const [instance] = usePDF({
    document: <ImagesPrintable photos={location.state?.photographies} />,
  });

  if (!location.state) navigator(PublicRoutes.Home);

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
        </>
      )}
    </main>
  );
}

export default PDFDownload;
