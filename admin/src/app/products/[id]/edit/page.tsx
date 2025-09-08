"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCategories } from "../../../../hooks/useCategories";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoriaName: string;
  productType: "Mayorista" | "Detal";
  gender: "All" | "Hombre" | "Mujer" | "Niños" | "Parejas";
  isActive: boolean;
  mayorista: boolean;
  mayoristaPrice: number;
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { categories } = useCategories();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setProduct(data);
        setImagePreview(data.imagen);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el producto"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("nombre", product.nombre);
      formData.append("descripcion", product.descripcion);
      formData.append("precio", product.precio.toString());
      formData.append("categoriaName", product.categoriaName);
      formData.append("productType", product.productType);
      formData.append("gender", product.gender);
      formData.append("isActive", product.isActive.toString());
      formData.append("mayorista", product.mayorista.toString());
      formData.append("mayoristaPrice", product.mayoristaPrice.toString());

      if (imageFile) {
        formData.append("imagen", imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }

      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error || "Producto no encontrado"}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link
          href="/products"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a productos
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={product.nombre}
                  onChange={(e) =>
                    setProduct({ ...product, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={product.precio}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      precio: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoriaName">Categoría</Label>
                <Select
                  value={product.categoriaName}
                  onValueChange={(value: string) =>
                    setProduct({ ...product, categoriaName: value })
                  }
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">Tipo de Producto</Label>
                <Select
                  value={product.productType}
                  onValueChange={(value: "Mayorista" | "Detal") =>
                    setProduct({ ...product, productType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mayorista">Mayorista</SelectItem>
                    <SelectItem value="Detal">Detal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select
                  value={product.gender}
                  onValueChange={(
                    value: "All" | "Hombre" | "Mujer" | "Niños" | "Parejas"
                  ) => setProduct({ ...product, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Todos</SelectItem>
                    <SelectItem value="Hombre">Hombre</SelectItem>
                    <SelectItem value="Mujer">Mujer</SelectItem>
                    <SelectItem value="Niños">Niños</SelectItem>
                    <SelectItem value="Parejas">Parejas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mayoristaPrice">Precio Mayorista</Label>
                <Input
                  id="mayoristaPrice"
                  type="number"
                  step="0.01"
                  value={product.mayoristaPrice || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      mayoristaPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={product.descripcion}
                onChange={(e) =>
                  setProduct({ ...product, descripcion: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagen">Imagen</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="w-20 h-20 relative rounded-md overflow-hidden">
                    <Image
                      height={60}
                      width={60}
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={product.isActive}
                  onChange={(e) =>
                    setProduct({ ...product, isActive: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="isActive">Producto activo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mayorista"
                  checked={product.mayorista}
                  onChange={(e) =>
                    setProduct({ ...product, mayorista: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="mayorista">Producto mayorista</Label>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Acciones rápidas</h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `${API_BASE_URL}/products/${id}/wholesale`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            mayorista: true,
                            mayoristaPrice: product.mayoristaPrice,
                          }),
                        }
                      );
                      if (response.ok) {
                        setProduct({
                          ...product,
                          mayorista: true,
                          mayoristaPrice:
                            product.mayoristaPrice || product.precio * 0.8,
                        });
                        alert("Producto actualizado a mayorista");
                      }
                    } catch {
                      alert("Error al actualizar a mayorista");
                    }
                  }}
                >
                  Marcar como mayorista
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `${API_BASE_URL}/products/${id}/wholesale`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            mayorista: false,
                            mayoristaPrice: 0,
                          }),
                        }
                      );
                      if (response.ok) {
                        setProduct({ ...product, mayorista: false, mayoristaPrice: 0 });
                        alert("Producto removido de mayorista");
                      }
                    } catch {
                      alert("Error al remover de mayorista");
                    }
                  }}
                >
                  Remover de mayorista
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    const newPrice = prompt(
                      "Ingrese el nuevo precio general:",
                      product.precio.toString()
                    );
                    if (newPrice && !isNaN(parseFloat(newPrice))) {
                      try {
                        const response = await fetch(
                          `${API_BASE_URL}/products/${id}/general-price`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              precio: parseFloat(newPrice),
                            }),
                          }
                        );
                        if (response.ok) {
                          setProduct({ ...product, precio: parseFloat(newPrice) });
                          alert("Precio general actualizado");
                        }
                      } catch {
                        alert("Error al actualizar precio general");
                      }
                    }
                  }}
                >
                  Actualizar precio general
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/products">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
