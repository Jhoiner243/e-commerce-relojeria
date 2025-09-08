import { z } from "zod";

export const productTypes = ["Mayorista", "Detal"] as const;

export const formSchema = z.object({
  nombre: z.string().min(1, { message: "Nombre requerido" }),
  descripcion: z.string().min(1, { message: "Descripcion requerida" }),
  precio: z.string().min(1, { message: "Precio requerido" }),
  categoriaName: z.string().min(1, { message: "Categoria requerida" }),
  productType: z.enum(productTypes),
  imagen: z.instanceof(File, { message: "Imagen requerida" }),
});