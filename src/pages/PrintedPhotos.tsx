import LoaderSpinner from "@/components/common/LoaderSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicRoutes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { ResponseError } from "@/models/ResponseError";
import { Photography } from "@/models/photography.model";
import { getPhotos } from "@/services/photos.service";
import { getNextMultiple } from "@/utils/mathOperations.util";
import {
  Image,
  ImageOff,
  Minus,
  Printer,
  SquareDashedMousePointer,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function PrintedPhotos() {
  const [photographies, setPhotographies] = useState<Photography[]>([]);
  const [selectedPhotographies, setSelectedPhotographies] = useState<
    Photography[]
  >([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    async function fetchPrintedPhotos() {
      try {
        setLoading(true);
        const photosResponse = await getPhotos({ printed: true });
        setPhotographies(photosResponse);
      } catch (error) {
        if (error instanceof ResponseError) return toast.error(error.message);
        toast.error("Ocurrió un error al cargar las fotos impresas");
      } finally {
        setLoading(false);
      }
    }

    fetchPrintedPhotos();
  }, []);

  const handleSelectPhoto = (
    photo: Photography,
    photoIndex: number,
    isShiftPressed: boolean
  ) => {
    setSelectedPhotographies((prev) => {
      if (isShiftPressed && lastSelectedIndex !== null) {
        const rangeStart = Math.min(lastSelectedIndex, photoIndex);
        const rangeEnd = Math.max(lastSelectedIndex, photoIndex);
        const photosInRange = photographies.slice(rangeStart, rangeEnd + 1);
        const selectedPhotoIds = new Set(prev.map((selected) => selected.id));
        const photosToAdd = photosInRange.filter(
          (rangePhoto) => !selectedPhotoIds.has(rangePhoto.id)
        );

        return [...prev, ...photosToAdd];
      }

      return [...prev, photo];
    });
    setLastSelectedIndex(photoIndex);
  };

  const handleUnselectPhoto = (photo: Photography) => {
    setSelectedPhotographies((prev) => {
      const cloned = [...prev];
      const index = cloned.findIndex(
        (selectedPhoto) => selectedPhoto.id === photo.id
      );
      cloned.splice(index, 1);
      return [...cloned];
    });
  };

  const handleUnselectAllPhotos = (photo: Photography) => {
    setSelectedPhotographies((prev) =>
      prev.filter((selectedPhoto) => selectedPhoto.id !== photo.id)
    );
  };

  const handleUnselectAll = () => {
    setSelectedPhotographies([]);
    setLastSelectedIndex(null);
  };

  const handlePrintPhotos = () => {
    if (selectedPhotographies.length % 4 !== 0)
      return toast.error(
        "La cantidad de fotografías seleccionadas debe ser múltiplo de 4"
      );

    navigator(PublicRoutes.PDFDownload, {
      state: { photographies: selectedPhotographies },
    });
  };

  const handleCopyPhotoCode = async (code: string) => {
    try {
      await window.navigator.clipboard.writeText(code);
      toast.success(`Código ${code} copiado al portapapeles`);
    } catch {
      toast.error("No se pudo copiar el código");
    }
  };

  const distinctPrintedPhotos = photographies.length;
  const totalPrintedPhotos = photographies.reduce(
    (acc, photo) => acc + (photo.printedQuantity ?? 1),
    0
  );

  return (
    <main className="min-h-[calc(100dvh-56px)] flex flex-col gap-4 justify-center items-center relative px-4 py-6">
      {!loading && (
        <>
          <section className="sticky top-14 z-10 w-full flex flex-wrap gap-4 sm:gap-6 justify-center items-center py-3 bg-background/60 backdrop-blur-sm backdrop-filter">
            {photographies.length > 0 && (
              <>
                <div className="flex justify-center items-center gap-2">
                  <Image className="w-6 h-6 text-primary" />
                  <h1 className="font-bold text-center">
                    {distinctPrintedPhotos} distintas
                  </h1>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <Printer className="w-6 h-6 text-primary" />
                  <h1 className="font-bold text-center">
                    {totalPrintedPhotos} totales
                  </h1>
                </div>
              </>
            )}
            {selectedPhotographies.length > 0 && (
              <>
                <div className="flex justify-center items-center gap-2">
                  <SquareDashedMousePointer className="w-6 h-6 text-primary" />
                  <h1 className="font-bold text-center">
                    {selectedPhotographies.length}/
                    {getNextMultiple(selectedPhotographies.length, 4)}
                  </h1>
                </div>

                <Button variant="outline" onClick={handlePrintPhotos}>
                  <Printer className="w-6 h-6 text-primary" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleUnselectAll}
                  title="Deseleccionar todas"
                >
                  <X className="w-6 h-6 text-primary" />
                </Button>
              </>
            )}
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photographies.map((photo, index) => (
              <figure
                className={cn(
                  "max-w-[300px] h-[300px] relative group rounded-lg cursor-pointer",
                  selectedPhotographies.some(
                    (selectedPhoto) => selectedPhoto.id === photo.id
                  )
                    ? "border-4 border-primary p-4"
                    : "border-2 border-transparent"
                )}
                key={photo.id}
              >
                <img
                  src={photo.url}
                  alt={photo.code}
                  className="w-full h-full object-contain rounded-lg shadow-lg"
                  onClick={(event) =>
                    handleSelectPhoto(photo, index, event.shiftKey)
                  }
                />

                <Badge
                  className="absolute bottom-2 left-2 cursor-copy group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto"
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleCopyPhotoCode(photo.code);
                  }}
                >
                  {photo.code}
                </Badge>

                {selectedPhotographies.some(
                  (selectedPhoto) => selectedPhoto.id === photo.id
                ) && (
                  <>
                    <div className="absolute top-2 right-2 flex justify-center items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleUnselectPhoto(photo)}
                      >
                        <Minus className="w-6 h-6" />
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => handleUnselectAllPhotos(photo)}
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>

                    <div className="absolute bottom-2 right-2 flex justify-center items-center gap-2">
                      <SquareDashedMousePointer className="w-6 h-6 text-primary" />
                      <h1 className="font-bold text-center">
                        {
                          selectedPhotographies.filter((p) => p.id === photo.id)
                            .length
                        }
                      </h1>
                    </div>
                  </>
                )}

                <div className="absolute top-2 left-2 flex justify-center items-center gap-2 bg-background/80 rounded-md px-2 py-1">
                  <Printer className="w-4 h-4 text-primary" />
                  <h1 className="font-bold text-center text-xs">
                    {photo.printedQuantity || 0}
                  </h1>
                </div>
              </figure>
            ))}
          </section>
        </>
      )}

      {!loading && photographies.length === 0 && (
        <div className="flex flex-col gap-6 items-center">
          <ImageOff className="w-20 h-20 sm:w-28 sm:h-28 text-primary" />
          <p className="text-center text-xl text-muted-foreground font-bold">
            No hay fotografías impresas para mostrar
          </p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-6 items-center">
          <LoaderSpinner />
          <p className="text-center text-xl text-muted-foreground font-bold">
            Cargando imágenes...
          </p>
        </div>
      )}
    </main>
  );
}

export default PrintedPhotos;
