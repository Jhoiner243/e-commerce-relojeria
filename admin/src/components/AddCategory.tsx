"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
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

const formSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
});

const AddCategory = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nombre: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  }
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Agregar categoría</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter category name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default AddCategory;
