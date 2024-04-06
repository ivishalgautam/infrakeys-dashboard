import { AiOutlineShop } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { GoChecklist } from "react-icons/go";
import { TbUserQuestion } from "react-icons/tb";
import {
  LayoutDashboard,
  Image,
  Tag,
  Factory,
  Users,
  MessageCircleQuestion,
  ShoppingCart,
} from "lucide-react";

// Define the roles for each user type
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const AllRoutes = [
  {
    label: "Dashboard",
    link: "/",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.USER],
  },
  {
    label: "Products",
    link: "/products",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products/create",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products/[id]/edit",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products/[id]/view",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    link: "/categories",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    link: "/categories/create",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    link: "/categories/edit/[id]",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    link: "/categories/view/[id]",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Sub categories",
    link: "/sub-categories",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Sub categories",
    link: "/sub-categories/create",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Sub categories",
    link: "/sub-categories/edit/[id]",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Sub categories",
    link: "/sub-categories/view/[id]",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Brands",
    link: "/brands",
    icon: Tag,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Banners",
    link: "/banners",
    icon: Image,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Industries",
    link: "/industries",
    icon: Factory,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Customers",
    link: "/customers",
    icon: Users,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Customers",
    link: "/customers/create",
    icon: Users,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Customers",
    link: "/customers/[id]/edit",
    icon: Users,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Customers",
    link: "/customers/[id]/view",
    icon: Users,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Enquiries",
    link: "/enquiries",
    icon: MessageCircleQuestion,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Enquiries",
    link: "/enquiries/[id]",
    icon: MessageCircleQuestion,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Orders",
    link: "/orders",
    icon: GoChecklist,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Orders",
    link: "/orders/create",
    icon: GoChecklist,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Orders",
    link: "/orders/[id]",
    icon: GoChecklist,
    roles: [ROLES.ADMIN],
  },
  {
    label: "All",
    link: "/all",
    icon: ShoppingCart,
    roles: [ROLES.USER],
  },
  {
    label: "Cart",
    link: "/cart",
    icon: ShoppingCart,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Queries",
    link: "/queries",
    icon: TbUserQuestion,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Queries",
    link: "/queries/[id]",
    icon: TbUserQuestion,
    roles: [ROLES.ADMIN],
  },
];
