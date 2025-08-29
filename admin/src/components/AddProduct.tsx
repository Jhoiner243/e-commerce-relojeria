"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

type Categoria = { id: string; nombre: string };

const productTypes = ["Mayorista", "Detal"] as const;

const formSchema = z.object({
  nombre: z.string().min(1, { message: "Nombre requerido" }),
  precio: z.coerce.number().min(1, { message: "Precio requerido" }),
  categoriaName: z.string().min(1, { message: "Categoria requerida" }),
  productType: z.enum(productTypes),
  imagen: z.instanceof(File, { message: "Imagen requerida" }),
});

type AddProductProps = {
  onCreated?: () => void;
  onClose?: () => void;
};

const AddProduct = ({ onCreated, onClose }: AddProductProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      precio: 0,
      categoriaName: "",
      productType: undefined as unknown as (typeof productTypes)[number],
      imagen: undefined as unknown as File,
    },
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState<boolean>(false);
  const [categoriasError, setCategoriasError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");

  useEffect(() => {
    void (async () => {
      setLoadingCategorias(true);
      setCategoriasError("");
      try {
        const res = await fetch("http://localhost:3003/api/categorias");
        if (!res.ok) throw new Error("Error cargando categorías");
        const data = (await res.json()) as Categoria[];
        setCategorias(data);
      } catch (e) {
        setCategoriasError("No se pudieron cargar las categorías");
      } finally {
        setLoadingCategorias(false);
      }
    })();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    const formData = new FormData();
    formData.append("nombre", values.nombre);
    formData.append("precio", values.precio.toString());
    formData.append("categoriaName", values.categoriaName);
    formData.append("productType", values.productType);
    formData.append("imagen", values.imagen);

    try {
      const res = await fetch("http://localhost:3003/api/products", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error creando el producto");
      setSubmitSuccess("Producto creado correctamente");
      form.reset();
      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("products:refresh"));
        }
      } catch {}
      if (onCreated) onCreated();
      if (onClose) onClose();
    } catch (e) {
      setSubmitError("No se pudo crear el producto");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Agregar producto</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                {categoriasError && (
                  <p className="text-sm text-red-600">{categoriasError}</p>
                )}
                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}
                {submitSuccess && (
                  <p className="text-sm text-green-600">{submitSuccess}</p>
                )}
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={submitting} />
                      </FormControl>
                      <FormDescription>
                        Nombre del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="precio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={submitting} />
                      </FormControl>
                      <FormDescription>
                        Precio del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoriaName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria del producto</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loadingCategorias || submitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                                                         {categorias.map((cat) => (
                               <SelectItem key={cat.id} value={cat.id}>
                                 {cat.nombre}
                               </SelectItem>
                             ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Categoria del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de producto</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={submitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Mayorista o Detal" />
                          </SelectTrigger>
                          <SelectContent>
                            {productTypes.map((pt) => (
                              <SelectItem key={pt} value={pt}>
                                {pt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Visibilidad de precios y acceso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imagen"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={submitting}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Sube una imagen del producto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               
         
                <Button type="submit" disabled={submitting || loadingCategorias || categorias.length === 0}>
                  {submitting ? "Guardando..." : "Submit"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
