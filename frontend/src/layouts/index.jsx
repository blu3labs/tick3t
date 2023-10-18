import { Outlet } from "react-router-dom";
import AppWrapper from "@/ui/wrapper/app";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

export default function MainLayout() {
  return (
    <AppWrapper>
      <Toaster />
      <Header />
      <Outlet />
    </AppWrapper>
  );
}
