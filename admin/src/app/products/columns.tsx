"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Product = {
  id: string;
  precio: string;
  nombre: string;
  descripcion: string;
  categoriaName: string;
  imagen: string;
  isActive: boolean;
  productType: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Product>[] = [
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
              <Link href={`/products/${product.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Ver producto
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/products/${product.id}/edit`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {product.isActive ? (
              <DropdownMenuItem className="text-orange-600">
                <EyeOff className="mr-2 h-4 w-4" />
                Desactivar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600">
                <Eye className="mr-2 h-4 w-4" />
                Activar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar permanentemente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
