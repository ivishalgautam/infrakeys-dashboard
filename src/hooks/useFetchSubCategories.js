import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../utils/endpoints.js";
import http from "../utils/http.js";

const fetchSubCategories = async () => {
  const { data } = await http().get(endpoints.sub_categories.getAll);
  return data;
};

export function useFetchSubCategories() {
  return useQuery(["sub-categories"], () => fetchSubCategories());
}
