"use client";

import http from "@/utils/http";
import { ProductForm } from "../../../components/Forms/Product.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import Section from "@/components/Section.js";
import { useRouter } from "next/navigation";

async function createProduct(data) {
  return http().post(endpoints.products.getAll, data);
}

export default function Create() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      toast.success("Product created.");
      router.push("/products");
    },
    onError: (error) => {
      toast.error(error.message ?? "error creating product!");
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  return (
    <Section>
      <ProductForm type="create" handleCreate={handleCreate} />
    </Section>
  );
}
