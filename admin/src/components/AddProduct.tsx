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
import { gender } from "../enum/gender";
import { useProductOperations } from "../hooks/useProductOperations";
import { useProducts } from "../hooks/useProducts";
import { formSchema, productTypes } from "./schemas/form-product";
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
import { LoadingOverlay } from "./ui/loading-overlay";
import Notification from "./ui/notification";
import { ScrollArea } from "./ui/scroll-area";

type Categoria = { id: string; nombre: string };




type AddProductProps = {
  onCreated?: () => void;
  onClose?: () => void;
};

const AddProduct = ({ onCreated, onClose }: AddProductProps) => {
  const {refreshProducts} = useProducts()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      gender: undefined as unknown as gender,
      categoriaName: "",
      productType: undefined as unknown as (typeof productTypes)[number],
      imagen: undefined as unknown as File,
      mayorista: false,
      mayoristaPrice: "",
    },
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState<boolean>(false);
  const [categoriasError, setCategoriasError] = useState<string>("");

  const { 
    loading: submitting, 
    error: submitError, 
    success: submitSuccess, 
    clearMessages,
    createProduct 
  } = useProductOperations({
    onSuccess: () => {
      form.reset();
      refreshProducts();
      if (onCreated) onCreated();
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error('Error creating product:', error);
    }
  });

  useEffect(() => {
    void (async () => {
      setLoadingCategorias(true);
      setCategoriasError("");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
        console.log("res", res)
        if (!res.ok) throw new Error("Error cargando categorías");
        const data = (await res.json()) as Categoria[];
        setCategorias(data);
      } catch  {
        setCategoriasError("No se pudieron cargar las categorías");
      } finally {
        setLoadingCategorias(false);
      }
    })();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    clearMessages();
    
    try {
      await createProduct({
        nombre: values.nombre,
        descripcion: values.descripcion,
        precio: Number(values.precio),
        categoriaName: values.categoriaName,
        productType: values.productType,
        gender: values.gender,
        imagen: values.imagen,
        mayorista: values.mayorista,
        mayoristaPrice: Number(values.mayoristaPrice),
      });
    } catch (error) {
      // Error is already handled by useProductOperations
      console.error('Error in onSubmit:', error);
    }
  }
  return (
    <SheetContent>
      <LoadingOverlay isLoading={submitting} message="Creando producto...">
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle className="mb-4">Agregar producto</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Notificaciones mejoradas */}
                  {categoriasError && (
                    <Notification
                      type="error"
                      title="Error de carga"
                      message={categoriasError}
                      onClose={() => setCategoriasError("")}
                    />
                  )}
                  {submitError && (
                    <Notification
                      type="error"
                      title="Error al crear producto"
                      message={submitError}
                      onClose={clearMessages}
                    />
                  )}
                  {submitSuccess && (
                    <Notification
                      type="success"
                      title="Éxito"
                      message={submitSuccess}
                      onClose={clearMessages}
                    />
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
                <FormField control={form.control} name="descripcion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripcion</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={submitting} />
                    </FormControl>
                    <FormDescription>
                      Descripcion del producto
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genero</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={submitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de genero" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(gender).map((pt, idx) => (
                              <SelectItem key={idx} value={pt}>
                                {pt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Genero del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imagen"
                  render={({ field: { onChange} }) => (
                    <div>

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
                    </FormItem>
                      <FormMessage />
                    </div>

                  )}
                />

                <FormField
                  control={form.control}
                  name="mayoristaPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Mayorista (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} disabled={submitting} />
                      </FormControl>
                      <FormDescription>
                        Precio especial para mayoristas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mayorista"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={submitting}
                          className="rounded"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Producto Mayorista</FormLabel>
                        <FormDescription>
                          Marcar si este producto está disponible para mayoristas
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
               
               
                <Button type="submit" disabled={submitting || loadingCategorias || categorias.length === 0}>
                  {submitting ? "Guardando..." : "Guardar"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
      </LoadingOverlay>
    </SheetContent>
  );
};

export default AddProduct;
