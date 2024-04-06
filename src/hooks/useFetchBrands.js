import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

async function fetchBrands() {
  const { data } = await http().get(endpoints.brands.getAll);
  return data;
}

export default function useFetchBrands() {
  return useQuery({
    queryFn: fetchBrands,
    queryKey: ["brands"],
  });
}
