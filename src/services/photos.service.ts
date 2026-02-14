import { Photography } from "@/models/photography.model";
import { ResponseError } from "@/models/ResponseError";

const BASE_URL = `${import.meta.env.VITE_API_URL}/photographies`;
type GetPhotosParams = {
  printed?: boolean;
};

export const uploadPhotos = async (photos: File[]): Promise<Photography> => {
  const formData = new FormData();
  photos.forEach((photo) => formData.append("images", photo));

  const response = await fetch(`${BASE_URL}/upload-multiple`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new ResponseError(`Error subiendo las fotografías`, response.status);
  }

  const { data } = await response.json();
  return data;
};

export const getPhotos = async (
  params?: GetPhotosParams
): Promise<Photography[]> => {
  const searchParams = new URLSearchParams({ order: "desc" });
  if (params?.printed !== undefined)
    searchParams.set("printed", String(params.printed));

  const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new ResponseError(
      `Error obteniendo las fotografías`,
      response.status
    );
  }

  const { data } = await response.json();
  return data;
};

export const confirmPrintedPhotos = async (
  items: { id: string; quantity: number }[]
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/confirm-printed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new ResponseError(
      `Error confirmando la impresión de las fotografías`,
      response.status
    );
  }
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${photoId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new ResponseError(`Error eliminando la fotografía`, response.status);
  }
};

export const deletePhotos = async (photoIds: string[]): Promise<void> => {
  const response = await fetch(`${BASE_URL}/delete-multiple`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: photoIds }),
  });

  if (!response.ok) {
    throw new ResponseError(
      `Error eliminando las fotografías`,
      response.status
    );
  }
};
