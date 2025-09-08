import { z } from "zod";
import { gender } from "../../enum/gender";

export const productTypes = ["Mayorista", "Detal"] as const;



export const formSchema = z.object({
  nombre: z.string().min(1, { message: "Nombre requerido" }),
  descripcion: z.string().min(1, { message: "Descripcion requerida" }),
  precio: z.string().min(1, { message: "Precio requerido" }),
  categoriaName: z.string().min(1, { message: "Categoria requerida" }),
  productType: z.enum(productTypes),
  gender: z.enum(Object.values(gender) as [string, ...string[]]),
  imagen: z.instanceof(File, { message: "Imagen requerida" }),
  mayorista: z.boolean().optional(),
  mayoristaPrice: z.string().optional(),
});