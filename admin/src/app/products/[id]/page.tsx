"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { useEffect, useState } from 'react'
import { Button } from 'react-day-picker'
import { Form, FormProvider, useForm } from 'react-hook-form'
import { z } from "zod"
import { formSchema, productTypes } from '../../../components/schemas/form-product'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { useCategories } from '../../../hooks/useCategories'
import { useProducts } from '../../../hooks/useProducts'
import { Product } from '../columns'

function ProductPage({params}: {params: { id: string }}) {
  const { id } = params
  const {categories, loading} = useCategories()
  const [product, setProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");
  const {refreshProducts} = useProducts()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: product?.nombre ?? "",
      descripcion: product?.descripcion ?? "",
      precio: product?.precio ?? "",
      categoriaName: product?.categoriaName ?? "",
      productType: undefined as unknown as (typeof productTypes)[number],
      imagen: undefined as unknown as File,
    },
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      if(!res.ok) throw new Error("Error al cargar producto")
      const data = await res.json()
      setProduct(data)
    })()
  }, [id])


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setSubmitSuccess("");
    const formData = new FormData();
    formData.append("nombre", values.nombre);
    formData.append("descripcion", values.descripcion);
    formData.append("precio", values.precio.toString());
    formData.append("categoriaName", values.categoriaName);
    formData.append("productType", values.productType);
    formData.append("imagen", values.imagen);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error creando el producto");
      setSubmitSuccess("Producto creado correctamente");
      form.reset();
      refreshProducts()
    
    } catch {
      setSubmitError("No se pudo crear el producto");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormProvider {...form}>
    <Form {...form}>
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
    
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
                disabled={loading || submitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                                               {categories.map((cat) => (
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
        render={({ field: { onChange } }) => (
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
     

      <Button type="submit" disabled={submitting || loading || categories.length === 0}>
        {submitting ? "Guardando..." : "Submit"}
      </Button>
    </form>
    </Form>
    </FormProvider>
  )
}

export default ProductPage