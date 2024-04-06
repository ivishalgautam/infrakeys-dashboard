"use client";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import Spinner from "@/components/Spinner";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

async function deleteProduct({ id }) {
  return http().delete(`${endpoints.products.getAll}/${id}`);
}

export default function Products() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useFetchProducts();

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      toast.success("Product deleted.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted.");
    },
    onError: (error) => {
      toast.error(error.message ?? "error deleting product!");
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return JSON.stringify(error);
  }

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <div className="flex items-center justify-between">
        <Title text={"Products"} />
        <Button asChild>
          <Link href={"/products/create"}>Create</Link>
        </Button>
      </div>

      <div>
        <DataTable columns={columns(handleDelete)} data={data} />
      </div>
    </div>
  );
}
