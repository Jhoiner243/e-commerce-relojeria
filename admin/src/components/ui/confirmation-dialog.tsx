"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Power, Save, Trash2 } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = 'default',
  icon,
  loading = false,
}: ConfirmationDialogProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
        };
      default:
        return {
          icon: <Save className="h-6 w-6 text-blue-600" />,
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
        };
    }
  };

  const styles = getVariantStyles();
  const displayIcon = icon || styles.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {displayIcon}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={loading}>
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className={styles.confirmButton}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Procesando..." : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Componentes especializados para casos comunes
export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "este elemento",
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
}) => (
  <ConfirmationDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Confirmar eliminación"
    description={`¿Estás seguro de que quieres eliminar ${itemName}? Esta acción no se puede deshacer.`}
    confirmText="Eliminar"
    variant="destructive"
    loading={loading}
  />
);

export const SaveConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  description = "¿Estás seguro de que quieres guardar los cambios?",
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  description?: string;
  loading?: boolean;
}) => (
  <ConfirmationDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Confirmar cambios"
    description={description}
    confirmText="Guardar"
    variant="default"
    loading={loading}
  />
);

export const StatusChangeConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "este elemento",
  newStatus = "activar",
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  newStatus?: string;
  loading?: boolean;
}) => (
  <ConfirmationDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title={`Confirmar ${newStatus}`}
    description={`¿Estás seguro de que quieres ${newStatus} ${itemName}?`}
    confirmText={newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
    variant="warning"
    icon={<Power className="h-6 w-6 text-yellow-600" />}
    loading={loading}
  />
);
