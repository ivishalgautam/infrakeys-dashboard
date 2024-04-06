"use client";
import Layout from "@/components/Layout";
import { AllRoutes } from "@/data/sidebarData";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Context from "@/store/context";
import { useParams, usePathname, useRouter } from "next/navigation";
import { PrimeReactProvider } from "primereact/api";
import QueryProvider from "@/components/QueryClientProvider";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const currentUser = JSON.parse(storedUser);

    if (pathname === "/login" || pathname === "/signup") {
      return;
    }

    // Find the current route in the AllRoutes array

    const currentRoute = AllRoutes?.find(
      (route) => route.link === pathname.replace(id, "[id]")
    );
    //  || route.link.includes(router.pathname)
    // If the current route is not found in the array or the user's role is not allowed for this route
    if (!currentRoute || !currentRoute?.roles?.includes(currentUser?.role)) {
      router.replace("/unauthorized");
    }
  }, [pathname]);

  const getContent = () => {
    // Array of all the paths that don't need the layout
    if (["/login", "/signup", "/unauthorized"].includes(pathname)) {
      return children;
    }

    return (
      <Context>
        <Layout>{children}</Layout>
      </Context>
    );
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={GeistSans.className}>
        <QueryProvider>
          <PrimeReactProvider>
            <Toaster richColors />
            {getContent()}
          </PrimeReactProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
