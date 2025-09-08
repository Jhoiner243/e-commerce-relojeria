"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Eye, EyeOff, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

 function PromotionsPage() {
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/promotions/all`);
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      } else {
        throw new Error('Error al cargar promociones');
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Error al cargar las promociones');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) {
      errors.titulo = 'El título es requerido';
    }
    
    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }
    
    if (!editingPromotion && !imageFile) {
      errors.imagen = 'La imagen es requerida';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormErrors(prev => ({ ...prev, imagen: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo.trim());
      formDataToSend.append('descripcion', formData.descripcion.trim());
      formDataToSend.append('isActive', formData.isActive.toString());

      if (imageFile) {
        formDataToSend.append('imagen', imageFile);
      }
      console.log('formDataToSend', Array.from(formDataToSend.entries()));
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
      toast.success(editingPromotion ? 'Promoción actualizada exitosamente' : 'Promoción creada exitosamente');
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error('Error al guardar la promoción');
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
    setFormErrors({});
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
    setFormErrors({});
  };

  const togglePromotionStatus = async (id: string, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus ? 'soft-delete' : 'restore';
      const response = await fetch(`${API_BASE_URL}/promotions/${id}/${endpoint}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        await fetchPromotions();
        toast.success(currentStatus ? 'Promoción desactivada' : 'Promoción activada');
      } else {
        throw new Error('Error al cambiar el estado');
      }
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      toast.error('Error al cambiar el estado de la promoción');
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
        toast.success('Promoción eliminada exitosamente');
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Error al eliminar la promoción');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
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
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => {
                      setFormData({ ...formData, titulo: e.target.value });
                      if (formErrors.titulo) setFormErrors(prev => ({ ...prev, titulo: '' }));
                    }}
                    className={formErrors.titulo ? 'border-red-500' : ''}
                  />
                  {formErrors.titulo && (
                    <p className="text-red-500 text-sm">{formErrors.titulo}</p>
                  )}
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
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => {
                    setFormData({ ...formData, descripcion: e.target.value });
                    if (formErrors.descripcion) setFormErrors(prev => ({ ...prev, descripcion: '' }));
                  }}
                  rows={4}
                  className={formErrors.descripcion ? 'border-red-500' : ''}
                />
                {formErrors.descripcion && (
                  <p className="text-red-500 text-sm">{formErrors.descripcion}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen">
                  Imagen {!editingPromotion && '*'}
                </Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="imagen"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={formErrors.imagen ? 'border-red-500' : ''}
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
                {formErrors.imagen && (
                  <p className="text-red-500 text-sm">{formErrors.imagen}</p>
                )}
                <p className="text-sm text-gray-500">
                  Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
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
          <Card key={promotion.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={promotion.imagen}
                alt={promotion.titulo}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={promotion.isActive ? "default" : "destructive"}>
                  {promotion.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {promotion.titulo}
              </h3>
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

      {promotions.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay promociones creadas</p>
          <p className="text-gray-400 text-sm mt-2">
            Crea tu primera promoción para comenzar
          </p>
        </div>
      )}
    </div>
  );
}

export default PromotionsPage;