"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

interface Promotion {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagen: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/promotions/all`);
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('isActive', formData.isActive.toString());

      if (imageFile) {
        formDataToSend.append('imagen', imageFile);
      }

      const url = editingPromotion 
        ? `${API_BASE_URL}/promotions/${editingPromotion.id}`
        : `${API_BASE_URL}/promotions`;
      
      const method = editingPromotion ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error al guardar la promoción');
      }

      await fetchPromotions();
      resetForm();
    } catch (error) {
      console.error('Error saving promotion:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      imagen: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingPromotion(null);
    setShowForm(false);
  };

  const editPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      titulo: promotion.titulo,
      descripcion: promotion.descripcion,
      imagen: promotion.imagen,
      isActive: promotion.isActive,
    });
    setImagePreview(promotion.imagen);
    setShowForm(true);
  };

  const togglePromotionStatus = async (id: string, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus ? 'soft-delete' : 'restore';
      const response = await fetch(`${API_BASE_URL}/promotions/${id}/${endpoint}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        await fetchPromotions();
      }
    } catch (error) {
      console.error('Error toggling promotion status:', error);
    }
  };

  const deletePromotion = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta promoción permanentemente?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchPromotions();
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando promociones...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
        <h1 className="font-semibold">Gestión de Promociones</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Promoción
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Estado</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="isActive">Promoción activa</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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
                    required={!editingPromotion}
                  />
                  {imagePreview && (
                    <div className="w-20 h-20 relative rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : (editingPromotion ? 'Actualizar' : 'Crear')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <div className="relative h-48">
              <Image
                src={promotion.imagen}
                alt={promotion.titulo}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={promotion.isActive ? "default" : "destructive"}>
                  {promotion.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{promotion.titulo}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {promotion.descripcion}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editPromotion(promotion)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePromotionStatus(promotion.id, promotion.isActive)}
                  >
                    {promotion.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePromotion(promotion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
