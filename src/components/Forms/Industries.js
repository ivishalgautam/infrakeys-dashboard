"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import useFileUpload from "@/hooks/useFileUpload";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";

export function IndustryForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  industryId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [filePath, setFilePath, handleFileChange, deleteFile] = useFileUpload();

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      is_featured: data.is_featured,
      image: filePath[0],
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(industryId);
    }
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      try {
        const { data } = await http().get(
          `${endpoints.industries.getAll}/getById/${industryId}`
        );

        data && setValue("name", data?.name);
        data && setValue("is_featured", data?.is_featured);
        data && setFilePath([data?.image]);
      } catch (error) {
        console.error(error);
      }
    };
    if (
      industryId &&
      (type === "edit" || type === "view" || type === "delete")
    ) {
      fetchData();
    }
  }, [industryId, type]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl">
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Add industry"
              : type === "view"
                ? "Industry details"
                : type === "edit"
                  ? "Edit industry"
                  : "Are you sure you want to delete"
          }
        />
        <div>
          <Label htmlFor="name">Industry Name</Label>
          <Input
            type="text"
            disabled={type === "view" || type === "delete"}
            placeholder="Industry Name"
            {...register("name", {
              required: "industry is required",
            })}
          />
          {errors.name && (
            <span className="text-red-600">{errors.name.message}</span>
          )}
        </div>

        {filePath?.length ? (
          <div className="relative inline-block">
            {(type === "edit" || type === "create") && (
              <button
                type="button"
                className="absolute -top-2 -right-2 rounded-md p-1 bg-red-500 text-white z-10"
                onClick={() => deleteFile(filePath[0])}
              >
                <AiOutlineDelete />
              </button>
            )}
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${filePath[0]}`}
              width={100}
              height={100}
              className="rounded-lg"
              alt="category image"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              {...register("image", {
                required: "Please select image",
              })}
              type="file"
              id="image"
              multiple
              onChange={handleFileChange}
            />
            {errors.image && (
              <span className="text-red-600">{errors.image.message}</span>
            )}
          </div>
        )}

        <div className="flex justify-center gap-1 flex-col mt-4">
          <Label htmlFor="is_featured">Is featured?</Label>
          <Controller
            control={control}
            name="is_featured"
            render={({ field: { onChange, value } }) => (
              <Switch
                onCheckedChange={onChange}
                checked={value}
                disabled={type === "view" || type === "delete"}
              />
            )}
          />
          {errors.is_featured && (
            <span className="text-red-600">{errors.is_featured.message}</span>
          )}
        </div>

        <div className="text-right">
          {type !== "view" && (
            <Button variant={type === "delete" ? "destructive" : "default"}>
              {type === "create"
                ? "Create"
                : type === "edit"
                  ? "Update"
                  : "Delete"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
