import ConfirmationModal from "@/components/common/ConfirmationModal";
import LoaderSpinner from "@/components/common/LoaderSpinner";
import UploadImagesModal from "@/components/printedPhotos/UploadImagesModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicRoutes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Photography } from "@/models/photography.model";
import { ResponseError } from "@/models/ResponseError";
import { deletePhotos, getPhotos } from "@/services/photos.service";
import { getNextMultiple } from "@/utils/mathOperations.util";
import {
  Image,
  ImageOff,
  Minus,
  Printer,
  SquareDashedMousePointer,
  TrashIcon,
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
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true);
        const photosResponse = await getPhotos();
        setPhotographies(photosResponse);
      } catch (error) {
        if (error instanceof ResponseError) return toast.error(error.message);
        toast.error("Ocurrió un error al cargar las fotos");
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [refetch]);

  const handleDeletePhotos = async () => {
    await deletePhotos([
      ...new Set(selectedPhotographies.map((photo) => photo.id)),
    ]);

    setPhotographies((prev) =>
      prev.filter(
        (photo) =>
          !selectedPhotographies.some(
            (selectedPhoto) => selectedPhoto.id === photo.id
          )
      )
    );
    setSelectedPhotographies([]);
    toast.success("Fotografías eliminadas correctamente");
  };

  const handleSelectPhoto = (photo: Photography) => {
    setSelectedPhotographies((prev) => {
      return [...prev, photo];
    });
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

  const handlePrintPhotos = () => {
    if (selectedPhotographies.length % 4 !== 0)
      return toast.error(
        "La cantidad de fotografías seleccionadas debe ser múltiplo de 4"
      );

    navigator(PublicRoutes.PDFDownload, {
      state: { photographies: selectedPhotographies },
    });
  };

  return (
    <main className="min-h-[calc(100dvh-56px)] flex flex-col gap-4 justify-center items-center relative px-4 py-6">
      {!loading && (
        <>
          <section className="flex gap-6 justify-between">
            {photographies.length > 0 && (
              <div className="flex justify-center items-center gap-2">
                <Image className="w-6 h-6 text-primary" />
                <h1 className="font-bold text-center">
                  {photographies.length}
                </h1>
              </div>
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

                <ConfirmationModal
                  title="Eliminar fotografías"
                  description="¿Estás seguro de eliminar estas fotografías?"
                  onAccept={handleDeletePhotos}
                >
                  <Button variant="outline">
                    <TrashIcon className="w-6 h-6 text-primary" />
                  </Button>
                </ConfirmationModal>
              </>
            )}
            <UploadImagesModal doRefetch={() => setRefetch((prev) => !prev)} />
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photographies.map((photo) => (
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
                  onClick={() => handleSelectPhoto(photo)}
                />

                <Badge className="absolute bottom-2 left-2 group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out">
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
              </figure>
            ))}
          </section>
        </>
      )}
      {!loading && photographies.length === 0 && (
        <div className="flex flex-col gap-6 items-center">
          <ImageOff className="w-20 h-20 sm:w-28 sm:h-28 text-primary" />
          <p className="text-center text-xl text-muted-foreground font-bold">
            No hay fotografías para mostrar
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
