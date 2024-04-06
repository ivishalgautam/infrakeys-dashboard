"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useFetchBrands from "@/hooks/useFetchBrands";
import { useFetchProducts } from "@/hooks/useFetchProducts";

import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AiOutlineDelete } from "react-icons/ai";
import { Editor } from "primereact/editor";

import Title from "../Title";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "@/components/ui/switch";
import { debounce } from "lodash";
import { H4 } from "../ui/typography";
import useFileUpload from "@/hooks/useFileUpload";
import ReactSelect from "react-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFetchSubCategories } from "@/hooks/useFetchSubCategories";
import { Textarea } from "../ui/textarea";
import Spinner from "../Spinner";

export function ProductForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  productId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { descriptions: [{ key: "", value: "" }] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "descriptions",
  });

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSetText = debounce(setText, 1000);
  // console.log(watch());
  const [tags, setTags] = useState([]);
  const editorRef = useRef(null);

  const { data: subCategories } = useFetchSubCategories();
  const { data: brands } = useFetchBrands();
  const { data: products } = useFetchProducts();
  const [pictures, setPictures, upload, deleteFile] = useFileUpload();

  const productStatus = [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
  ];

  const formattedSubCategories = subCategories?.map(
    ({ id: value, name: label }) => ({
      value,
      label,
    })
  );

  const formattedBrands = brands?.map(({ id: value, name: label }) => ({
    value,
    label,
  }));

  const formattedProducts = products?.map(({ id: value, title: label }) => ({
    value,
    label,
  }));

  const onSubmit = (data) => {
    if (type === "delete") {
      return handleDelete({ id: productId });
    }

    const payload = {
      title: data.name,
      description: text,
      custom_description: data.descriptions,
      pictures: pictures,
      tags: tags,
      sku: data?.sku,
      brand_id: data?.brand_id,
      sub_category_id: data?.sub_category_id,
      status: data?.status?.value,
      is_featured: data?.is_featured,
      related_products: data?.related_products?.map((so) => so.value),
      meta_title: data?.meta_title,
      meta_description: data?.meta_description,
      meta_keywords: data?.meta_keywords,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    }

    reset();
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await http().get(
          `${endpoints.products.getAll}/getById/${productId}`
        );
        data && setValue("name", data?.title);
        data && setValue("sub_category_id", data?.sub_category_id);
        data && setValue("status", data?.status);
        data && setValue("brand_id", data?.brand_id);
        data &&
          data.custom_description &&
          data?.custom_description?.map(({ key, value }) => {
            remove();
            append({ key, value });
          });
        data && setPictures(data?.pictures);
        data && setTags(data?.tags);
        if (!editorRef.current) {
          data && setText(data?.description);
          editorRef.current = true;
        }
        // data && setValue("description", data?.description);
        data && setValue("is_featured", data?.is_featured);
        data && setValue("sku", data?.sku);
        data && setValue("meta_title", data?.meta_title);
        data && setValue("meta_description", data?.meta_description);
        data && setValue("meta_keywords", data?.meta_keywords);
        data?.related_products &&
          setValue(
            "related_products",
            formattedProducts?.filter((so) =>
              data?.related_products?.includes(so.value)
            )
          );
        data && setPictures(data?.pictures);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && (type === "edit" || type === "view")) {
      fetchData();
    }
  }, [
    productId,
    type,
    formattedSubCategories?.length,
    formattedBrands?.length,
    formattedProducts?.length,
  ]);

  const handleFileChange = async (event) => {
    upload(event);
  };

  const addTag = () => {
    if (getValues("tag") === "") {
      return toast.warning("Please enter tag name");
    }

    const updatedTags = new Set([...tags, getValues("tag")]);

    updatedTags.add(getValues("tag").trim());
    setTags([...Array.from(updatedTags)]);
    setValue("tag", "");
  };

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {type !== "delete" ? (
          <div className="space-y-6">
            {/* title */}
            <div className="">
              <Title
                text={
                  type === "create"
                    ? "Create product"
                    : type === "view"
                      ? "Product details"
                      : type === "edit"
                        ? "Edit product"
                        : "Are you sure you want to delete"
                }
              />
            </div>

            {/* product info */}
            <div className="space-y-4">
              <H4>Product Information</H4>
              <div className="grid grid-cols-3 gap-2">
                {/* product name */}
                <div>
                  <Label htmlFor="name">Product name</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="Product Name"
                    {...register("name", {
                      required: "Product name is required",
                    })}
                  />
                  {errors.name && (
                    <span className="text-red-600">{errors.name.message}</span>
                  )}
                </div>

                {/* sub category */}
                <div>
                  <Label htmlFor="sub_category_id">Sub catgeory</Label>
                  <Controller
                    control={control}
                    name="sub_category_id"
                    maxMenuHeight={230}
                    rules={{ required: "Please select sub category" }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        onValueChange={onChange}
                        className="w-full"
                        disabled={type === "view" || type === "delete"}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select a sub category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Sub category</SelectLabel>
                            {formattedSubCategories?.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.sub_category_id && (
                    <span className="text-red-600">
                      {errors.sub_category_id.message}
                    </span>
                  )}
                </div>

                {/* product status */}
                <div>
                  <Label htmlFor="status">Product Status</Label>
                  <Controller
                    control={control}
                    name="status"
                    maxMenuHeight={230}
                    rules={{ required: "Please select status" }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        onValueChange={onChange}
                        className="w-full"
                        disabled={type === "view" || type === "delete"}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            {productStatus?.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.status && (
                    <span className="text-red-600">
                      {errors.status.message}
                    </span>
                  )}
                </div>

                {/* product brand */}
                <div>
                  <Label htmlFor="brand_id">Product Brand</Label>
                  <Controller
                    control={control}
                    name="brand_id"
                    maxMenuHeight={230}
                    rules={{ required: "Please select brand" }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        onValueChange={onChange}
                        className="w-full"
                        disabled={type === "view" || type === "delete"}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Brand</SelectLabel>
                            {formattedBrands?.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.brand_id && (
                    <span className="text-red-600">
                      {errors.brand_id.message}
                    </span>
                  )}
                </div>

                {/* sku */}
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="SKU"
                    {...register("sku", {
                      required: "SKU is required",
                    })}
                  />
                  {errors.sku && (
                    <span className="text-red-600">{errors.sku.message}</span>
                  )}
                </div>

                {/* tags */}
                <div className="col-span-3">
                  <Label htmlFor="quantity">Tags</Label>
                  <div className="grid grid-cols-12 gap-2 border p-0.5 rounded">
                    <div className="flex flex-wrap items-center col-span-10 gap-2 px-1">
                      {tags?.map((tag, key) => (
                        <span
                          key={key}
                          className="bg-primary rounded-lg p-1 px-2 text-white cursor-pointer"
                          onClick={() => {
                            if (type === "view") return;
                            const updatedTags = tags?.filter(
                              (item) => item !== tag
                            );
                            setTags(updatedTags);
                          }}
                        >
                          {type === "view" ? tag : `${tag} x`}
                        </span>
                      ))}

                      {type !== "view" && (
                        <Input
                          {...register("tag")}
                          type="tag"
                          disabled={type === "view" || type === "delete"}
                          placeholder="Enter tag name"
                          className="w-auto"
                        />
                      )}
                    </div>

                    {type !== "view" && (
                      <div className="col-span-2">
                        <Button
                          type="button"
                          className="w-full"
                          disabled={type === "view"}
                          onClick={addTag}
                        >
                          Add tag
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* related products */}
                <div className="col-span-3">
                  <Label htmlFor="related_products">Related products</Label>
                  <Controller
                    control={control}
                    name="related_products"
                    maxMenuHeight={230}
                    render={({ field }) => (
                      <ReactSelect
                        {...field}
                        isMulti
                        options={formattedProducts}
                        placeholder="Select related products"
                        isDisabled={type === "view"}
                        className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-sm"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={
                          typeof document !== "undefined" && document.body
                        }
                        menuPosition="absolute"
                      />
                    )}
                  />

                  {errors.related_products && (
                    <span className="text-red-600">
                      {errors.related_products.message}
                    </span>
                  )}
                </div>

                {/* description */}
                <div className="col-span-3">
                  <Label htmlFor="description">Description</Label>
                  <Editor
                    focus={editorRef.current}
                    readOnly={type === "view"}
                    name="blog"
                    value={text}
                    onTextChange={(e) => debouncedSetText(e.htmlValue)}
                    style={{ height: "320px" }}
                  />
                </div>
              </div>
            </div>

            {/* custom description */}
            <div className="space-y-4">
              <H4>Custom descriptions</H4>

              <div>
                {fields.map((field, key) => (
                  <div
                    key={key}
                    className="flex items-end justify-center gap-2"
                  >
                    <div className="flex-1">
                      <Label>Name</Label>
                      <Input
                        {...register(`descriptions.${key}.key`, {
                          required: "required",
                        })}
                        placeholder="Custom key"
                        disabled={type === "view"}
                      />
                      {errors.descriptions && (
                        <span className="text-red-600">
                          {errors.descriptions?.[key]?.key?.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label>Value</Label>
                      <Input
                        {...register(`descriptions.${key}.value`, {
                          required: "required",
                        })}
                        placeholder="Custom value"
                        disabled={type === "view"}
                      />
                      {errors.descriptions && (
                        <span className="text-red-600">
                          {errors.descriptions?.[key]?.value?.message}
                        </span>
                      )}
                    </div>
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
                ))}
              </div>
              {type !== "view" && (
                <Button type="button" onClick={() => append()}>
                  Add
                </Button>
              )}
            </div>

            {/* product media */}
            <div className="space-y-4">
              <div className="space-y-1">
                <H4>Product Media</H4>
                <p className="text-gray-400 text-sm">
                  Upload captivating images and videos to make your product
                  stand out.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 gap-y-4">
                {pictures?.length ? (
                  pictures?.map((picture) => (
                    <div key={picture} className="relative w-48 h-32">
                      <Button
                        type="button"
                        className="absolute -top-2 -right-2 rounded-md bg-red-500 text-white z-10"
                        onClick={() => deleteFile(picture)}
                        disabled={type === "view"}
                      >
                        <AiOutlineDelete size={20} />
                      </Button>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${picture}`}
                        width={200}
                        height={200}
                        alt="image"
                        className="rounded-xl"
                      />
                    </div>
                  ))
                ) : (
                  <div>
                    <Label htmlFor="picture">Pictures</Label>
                    <Input
                      {...register("picture", {
                        required: "Please select pictures",
                      })}
                      type="file"
                      id="picture"
                      multiple
                      onChange={(e) => handleFileChange(e, null)}
                    />
                    {errors.picture && (
                      <span className="text-red-600">
                        {errors.picture.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* <p className="text-gray-400 text-sm">
                Recommended size (1000px*1248px)
              </p> */}
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
                    {...register("meta_title", {
                      required: "Please enter title tag.",
                    })}
                    disabled={type === "view"}
                  />
                  {errors.meta_title && (
                    <span className="text-red-600">
                      {errors.meta_title.message}
                    </span>
                  )}
                </div>

                {/* meta descrition */}
                <div>
                  <Label htmlFor={"meta_description"}>Meta description</Label>
                  <Input
                    type="text"
                    placeholder="Enter meta description tag"
                    {...register("meta_description")}
                    disabled={type === "view"}
                  />
                  {errors.meta_description && (
                    <span className="text-red-600">
                      {errors.meta_description.message}
                    </span>
                  )}
                </div>

                {/* meta keyword */}
                <div>
                  <Label htmlFor={"meta_keywords"}>Meta keywords</Label>
                  <Textarea
                    type="text"
                    placeholder="Enter meta keywords"
                    {...register("meta_keywords")}
                    disabled={type === "view"}
                  />
                  {errors.meta_keywords && (
                    <span className="text-red-600">
                      {errors.meta_keywords.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* is featured */}
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
                <span className="text-red-600">
                  {errors.is_featured.message}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p>Are you sure you want to delete!</p>
        )}

        {/* submit */}
        <div className="text-right">
          {type !== "view" && (
            <Button variant={type === "delete" ? "destructive" : "primary"}>
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
