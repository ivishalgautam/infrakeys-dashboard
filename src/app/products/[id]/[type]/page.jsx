"use client";

import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { ProductForm } from "@/components/Forms/Product";
import { useRouter } from "next/navigation";
import Section from "@/components/Section";

async function updateProduct(data) {
  return http().put(`${endpoints.products.getAll}/${data.id}`, data);
}

export default function Page({ params: { id, type } }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const updateMutation = useMutation(updateProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated.");
      router.push("/products");
    },
    onError: (error) => {
      toast.error(error.message ?? "error updating product");
    },
  });

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: id });
  };

  return (
    <Section>
      <ProductForm type={type} productId={id} handleUpdate={handleUpdate} />
    </Section>
  );
}
