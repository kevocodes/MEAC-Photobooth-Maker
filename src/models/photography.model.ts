export interface Photography {
  id: string;
  code: string;
  url: string;
  width: number;
  height: number;
  public_id: string;
  printedAt?: string | null;
  printedQuantity?: number | null;
  createdAt: string;
  updatedAt: string;
}
