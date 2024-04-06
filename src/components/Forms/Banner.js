"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import { isObject } from "@/utils/object";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import { Label } from "../ui/label";
import Modal from "../Modal";
import { endpoints } from "../../utils/endpoints";
import Spinner from "../Spinner";
import useFileUpload from "@/hooks/useFileUpload";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFetchCategories } from "@/hooks/useFetchCategories";

export function BannerForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  closeModal,
  bannerId,
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [image, setImage, upload, deleteFile] = useFileUpload();
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState("");
  const [openDocViewer, setOpenDocViewer] = useState(false);

  const { data: categories } = useFetchCategories();

  const formattedCategories = categories?.map(({ id: value, name: label }) => ({
    value,
    label,
  }));

  const onSubmit = (data) => {
    const payload = {
      image: image[0],
      category_id: data?.category_id,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(bannerId);
    }
    closeModal();
  };
  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await http().get(
          `${endpoints.banners.getAll}/${bannerId}`
        );

        data && setImage([data?.image]);
        data && setValue("category_id", data?.category_id);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (bannerId && (type === "edit" || type === "view" || type === "delete")) {
      fetchData();
    }
  }, [bannerId, type]);

  const handleFileChange = async (event) => {
    upload(event);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white">
        <Title
          text={
            type === "create"
              ? "Create banner"
              : type === "view"
                ? "Banner details"
                : type === "edit"
                  ? "Banner category"
                  : "Are you sure you want to delete"
          }
        />
        <div className="space-y-16 p-2">
          {image?.length ? (
            <div className="relative h-32 w-full">
              {type === "edit" || type === "create" ? (
                <button
                  type="button"
                  className="absolute -right-2 -top-2 z-10 rounded-md bg-red-500 p-1 text-white"
                  onClick={() => deleteFile(image[0])}
                >
                  <AiOutlineDelete />
                </button>
              ) : (
                <></>
              )}
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image[0]}`}
                width={400}
                height={100}
                className="rounded-lg"
                alt="category image"
                onClick={() => {
                  setOpenDocViewer(true);
                  setDocs(
                    `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image[0]}`
                  );
                }}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="picture">Picture</Label>
              <Input
                {...register("picture", {
                  required: "Please select image",
                })}
                type="file"
                id="picture"
                multiple
                onChange={handleFileChange}
              />
              {errors.picture && (
                <span className="text-red-600">{errors.picture.message}</span>
              )}
            </div>
          )}

          {/* category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Controller
              control={control}
              name="category_id"
              maxMenuHeight={230}
              rules={{ required: "Please select category" }}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value}
                  onValueChange={onChange}
                  className="w-full"
                  disabled={type === "view" || type === "delete"}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {formattedCategories?.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.category_id && (
              <span className="text-red-600">{errors.category_id.message}</span>
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
      <Modal onClose={() => setOpenDocViewer(false)} isOpen={openDocViewer}>
        <div className="relative aspect-[9/16]">
          <Image
            src={docs}
            fill
            alt="image"
            className="object-contain object-center"
          />
        </div>
      </Modal>
    </>
  );
}
