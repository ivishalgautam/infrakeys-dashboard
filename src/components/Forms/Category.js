"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import useLocalStorage from "@/hooks/useLocalStorage";
import { isObject } from "@/utils/object";
import { AiOutlineDelete } from "react-icons/ai";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../ui/textarea";
import { H2, H4 } from "../ui/typography";
import useFileUpload from "@/hooks/useFileUpload";
import Spinner from "../Spinner";

export function CategoryForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  categoryId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { faq: [{ question: "", answer: "" }] } });
  const [isLoading, setIsLoading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq",
  });

  const [pictures, setPictures, uploadPicture, deletePicture] = useFileUpload();
  const [banners, setBanners, uploadBanners, deleteBanner] = useFileUpload();
  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      is_featured: data.is_featured,
      image: pictures[0],
      banners: banners,
      faq: data.faq,
      meta_title: data?.meta_title,
      meta_description: data?.meta_description,
      meta_keywords: data?.meta_keywords,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(categoryId);
    }
    reset();
  };
  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await http().get(
          `${endpoints.categories.getAll}/getById/${categoryId}`
        );

        data && setValue("name", data?.name);
        data && setValue("is_featured", data?.is_featured);
        data && setPictures([data?.image]);
        data && setBanners(data?.banners);
        remove();
        data &&
          data?.faq &&
          data?.faq?.map(({ question, answer }) => {
            append({ question, answer });
          });
        data && setValue("meta_title", data?.meta_title);
        data && setValue("meta_description", data?.meta_description);
        data && setValue("meta_keywords", data?.meta_keywords);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (
      categoryId &&
      (type === "edit" || type === "view" || type === "delete")
    ) {
      fetchData();
    }
  }, [categoryId, type]);

  const handlePictureChange = async (event) => {
    uploadPicture(event);
  };

  const handleBannerChange = async (event) => {
    uploadBanners(event);
  };

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Create category"
              : type === "view"
                ? "Category details"
                : type === "edit"
                  ? "Edit category"
                  : "Are you sure you want to delete"
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              disabled={type === "view" || type === "delete"}
              // className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              placeholder="Category Name"
              {...register("name", {
                required: "Category is required",
              })}
            />
            {errors.name && (
              <span className="text-red-600">{errors.name.message}</span>
            )}
          </div>
        </div>
        {pictures?.length ? (
          <div className="relative inline-block">
            {(type === "edit" || type === "create") && (
              <button
                type="button"
                className="absolute -top-2 -right-2 rounded-md p-1 bg-red-500 text-white z-10"
                onClick={() => deletePicture(pictures[0])}
              >
                <AiOutlineDelete />
              </button>
            )}
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${pictures[0]}`}
              width={100}
              height={100}
              className="rounded-lg"
              alt="category image"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="picture">Picture</Label>
            <Input
              {...register("picture", {
                required: "Please select pictures",
              })}
              type="file"
              id="picture"
              onChange={handlePictureChange}
            />
            {errors.picture && (
              <span className="text-red-600">{errors.picture.message}</span>
            )}
          </div>
        )}
        {/* banners */}
        <div>
          <Title text={"Banners"} />
          {/* banners */}
          {banners?.length ? (
            <div className="space-x-4">
              {banners?.map((banner, ind) => (
                <div className="relative inline-block" key={ind}>
                  {(type === "edit" || type === "create") && (
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 rounded-md p-1 bg-red-500 text-white z-10"
                      onClick={() => deleteBanner(banner)}
                    >
                      <AiOutlineDelete />
                    </button>
                  )}
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${banner}`}
                    width={100}
                    height={100}
                    className="rounded-lg"
                    alt="category image"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Input
                {...register("banners", {
                  required: "Please select banners",
                })}
                type="file"
                id="banners"
                multiple
                onChange={handleBannerChange}
              />
              {errors.banners && (
                <span className="text-red-600">{errors.banners.message}</span>
              )}
            </div>
          )}
        </div>

        {/* faq */}
        <div className="col-span-3 bg-white space-y-2">
          <Title text={"FAQ"} />

          <div className="space-y-4">
            {fields.map((field, key) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <H4> Question: {key + 1}</H4>
                  {type !== "view" && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => remove(key)}
                    >
                      <AiOutlineDelete size={20} />
                    </Button>
                  )}
                </div>
                <div>
                  <Label>Question</Label>
                  <Input
                    {...register(`faq.${key}.question`, {
                      required: "required",
                    })}
                    placeholder="Question"
                    disabled={type === "view"}
                  />
                  {errors.faq && (
                    <span className="text-red-600">
                      {errors.faq?.[key]?.question?.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label>Answer</Label>
                  <Textarea
                    {...register(`faq.${key}.answer`, {
                      required: "required",
                    })}
                    placeholder="Answer"
                    disabled={type === "view"}
                  />
                  {errors.faq && (
                    <span className="text-red-600">
                      {errors.faq?.[key]?.answer?.message}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {type !== "view" && (
            <Button type="button" onClick={() => append()}>
              Add
            </Button>
          )}
        </div>

        {/* product seo */}
        <div className="space-y-4">
          <H4>Product SEO</H4>
          <div className="grid grid-cols-1 gap-2">
            {/* meta title */}
            <div>
              <Label htmlFor={"meta_title"}>Meta title</Label>
              <Input
                type="text"
                placeholder="Enter title tag"
                {...register("meta_title")}
                disabled={type === "view" || type === "delete"}
              />
            </div>

            {/* meta descrition */}
            <div>
              <Label htmlFor={"meta_description"}>Meta description</Label>
              <Textarea
                placeholder="Enter meta description tag"
                {...register("meta_description")}
                disabled={type === "view" || type === "delete"}
              />
            </div>

            {/* meta keywords */}
            <div>
              <Label htmlFor={"meta_keywords"}>Meta keywords</Label>
              <Textarea
                placeholder="Enter meta keywords"
                {...register("meta_keywords")}
                disabled={type === "view" || type === "delete"}
              />
            </div>
          </div>
        </div>

        {/* is featured */}
        <div className="flex justify-center gap-1 flex-col mt-4 col-span-3">
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
