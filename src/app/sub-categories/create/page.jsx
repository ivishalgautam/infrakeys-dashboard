"use client";
import { CategoryForm } from "@/components/Forms/Category";
import Section from "@/components/Section";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SubCategoryForm } from "@/components/Forms/SubCategory";
import { useRouter } from "next/navigation";

async function postSubCategory(data) {
  return http().post(endpoints.sub_categories.getAll, data);
}

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const createMutation = useMutation(postSubCategory, {
    onSuccess: () => {
      toast.success("New sub category added.");
      queryClient.invalidateQueries("sub-categories");
      router.push("/sub-categories");
    },
    onError: (error) => {
      toast.error(error.message ?? "Error creating sub category");
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };
  return (
    <Section>
      <SubCategoryForm type={"create"} handleCreate={handleCreate} />
    </Section>
  );
}
