import { endpoints } from "@/utils/endpoints";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import useLocalStorage from "./useLocalStorage";
import http from "@/utils/http";

export default function useFileUpload() {
  const [filePath, setFilePath] = useState([]);
  const [token] = useLocalStorage("token");

  const uploadFile = async (event) => {
    try {
      const selectedFiles = Array.from(event.target.files);
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });
      console.log("formData=>", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFilePath((prev) => [...prev, ...response.data?.path]);

      console.log("Upload successful:", response.data.path);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const deleteFile = async (filePath) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`
      );
      setFilePath((prev) => prev.filter((i) => i !== filePath));
      toast.success(resp.message);
    } catch (error) {
      console.log(error);
      toast.error("error deleting image");
    }
  };

  return [filePath, setFilePath, uploadFile, deleteFile];
}
