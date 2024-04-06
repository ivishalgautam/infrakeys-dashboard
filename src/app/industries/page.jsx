"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BrandForm } from "@/components/Forms/Brand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import Spinner from "@/components/Spinner";
import { isObject } from "@/utils/object";
import { toast } from "sonner";
import { IndustryForm } from "@/components/Forms/Industries";

async function postIndustry(data) {
  return http().post(endpoints.industries.getAll, data);
}

async function updateIndustry(data) {
  return http().put(`${endpoints.industries.getAll}/${data.id}`, data);
}

async function deleteIndustry(data) {
  return http().delete(`${endpoints.industries.getAll}/${data.id}`);
}

async function fetchIndustries() {
  const { data } = await http().get(endpoints.industries.getAll);
  return data;
}

export default function Industries() {
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("");
  const [industryId, setIndustryId] = useState(null);
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchIndustries,
    queryKey: ["industries"],
  });

  const createMutation = useMutation(postIndustry, {
    onSuccess: () => {
      toast.success("New industry added.");
      queryClient.invalidateQueries("industries");
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

  const updateMutation = useMutation(updateIndustry, {
    onSuccess: () => {
      toast.success("Industry updated.");
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      closeModal();
    },
    onError: (error) => {
      if (isObject(error)) {
        toast(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const deleteMutation = useMutation(deleteIndustry, {
    onSuccess: () => {
      toast.success("Industry deleted.");
      queryClient.invalidateQueries({ queryKey: ["industries"] });
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

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: industryId });
  };

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    toast.error(error?.message ?? "error");
    return "error";
  }

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <div className="flex items-center justify-between">
        <Title text={"Industries"} />

        <Button
          onClick={() => {
            setType("create");
            openModal();
          }}
        >
          Create
        </Button>
      </div>
      <div>
        <DataTable
          columns={columns(setType, openModal, setIndustryId)}
          data={data?.map(({ id, name }) => ({ id, name }))}
        />
      </div>

      {isModal && (
        <Modal isOpen={isModal} onClose={closeModal}>
          <IndustryForm
            type={type}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            closeModal={closeModal}
            industryId={industryId}
          />
        </Modal>
      )}
    </div>
  );
}
