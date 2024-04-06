"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { CategoryForm } from "@/components/Forms/Category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "@/components/Spinner";
import { isObject } from "@/utils/object";
import { toast } from "sonner";
import Link from "next/link";

async function deleteSubCategory(data) {
  return http().delete(`${endpoints.sub_categories.getAll}/${data.id}`);
}

async function fetchSubCategories() {
  const { data } = await http().get(endpoints.sub_categories.getAll);
  return data;
}

export default function Categories() {
  const [categoryId, setCategoryId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchSubCategories,
    queryKey: ["sub-categories"],
  });

  const deleteMutation = useMutation(deleteSubCategory, {
    onSuccess: () => {
      toast.success("Sub category deleted.");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      closeModal();
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    toast.error(error.message);
    return "error";
  }

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <div className="flex items-center justify-between">
        <Title text={"Sub Categories"} />

        <Link
          className={buttonVariants("default")}
          href={"/sub-categories/create"}
        >
          Create
        </Link>
      </div>
      <div>
        <DataTable
          columns={columns(handleDelete)}
          data={data?.map((subCategory) => subCategory)}
        />
      </div>
    </div>
  );
}
