import { ResponseError } from "@/models/ResponseError";
import { uploadPhotos } from "@/services/photos.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FileUpload from "@/components/common/FileUpload";
import { PublicRoutes } from "@/constants/routes";

function PhotoUpload() {
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmitPhotos = async (files: File[]) => {
    try {
      setLoading(true);
      const photosResponses = await uploadPhotos(files);
      navigator(PublicRoutes.PDFDownload, { state: { photographies:  photosResponses} });
    } catch (error) {
      if (error instanceof ResponseError) return toast.error(error.message);
      toast.error("Error subiendo las fotos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100dvh-56px)] flex flex-col gap-4 justify-center items-center relative p-4">
      <h1 className="text-xl sm:text-2xl font-bold text-primary mb-4">Sube las fotografías</h1>
      <section className="w-full max-w-lg">
        <FileUpload
          uploadMode="multi"
          acceptedFileTypes={{
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
          }}
          onSubmitFiles={onSubmitPhotos}
          defaultText="Arrastra y suelta las fotografías aquí"
          otherText="o haz clic para seleccionarlas"
          loading={loading}
          requiredPhotosNumber={4}
        />
      </section>
    </main>
  );
}

export default PhotoUpload;
