"use client";


import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

export type Product = {
  id: string;
  precio: string;
  nombre: string;
  descripcion: string;
  categoriaName: string;
  imagen: string;
  isActive: boolean;
  productType: string;
  mayorista: boolean;
  mayoristaPrice: number;
  createdAt: string;
  updatedAt: string;
};

interface ColumnsProps {
  onSoftDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleWholesale: (id: string, isWholesale: boolean) => void;
}

export const createColumns = ({ onSoftDelete, onRestore, onDelete, onToggleWholesale }: ColumnsProps): ColumnDef<Product>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "imagen",
    header: "Imagen",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="w-12 h-12 relative rounded-md overflow-hidden">
          {product.imagen ? (
            <Image
              alt={product.nombre}
              src={product.imagen}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">Sin imagen</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">{product.nombre}</div>
          <div className="text-sm text-gray-500 truncate">{product.descripcion}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "precio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "categoriaName",
    header: "Categoría",
  },
  {
    accessorKey: "productType",
    header: "Tipo",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Badge variant={product.productType === "Mayorista" ? "default" : "secondary"}>
          {product.productType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "mayorista",
    header: "Mayorista",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex flex-col">
          <Badge variant={product.mayorista ? "default" : "outline"}>
            {product.mayorista ? "Sí" : "No"}
          </Badge>
          {product.mayorista && product.mayoristaPrice > 0 && (
            <span className="text-xs text-gray-500 mt-1">
              ${product.mayoristaPrice.toFixed(2)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Badge variant={product.isActive ? "default" : "destructive"}>
          {product.isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link href={`/products/${product.id}/edit`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onToggleWholesale(product.id, !product.mayorista)}
              className={product.mayorista ? "text-orange-600" : "text-green-600"}
            >
              {product.mayorista ? "Remover de Mayorista" : "Marcar como Mayorista"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {product.isActive ? (
              <DropdownMenuItem 
                className="text-orange-600"
                onClick={() => onSoftDelete(product.id)}
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Desactivar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="text-green-600"
                onClick={() => onRestore(product.id)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Activar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar permanentemente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
