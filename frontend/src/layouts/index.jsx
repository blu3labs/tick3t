import { Outlet } from "react-router-dom";
import AppWrapper from "@/ui/wrapper/app";
import Header from "@/components/header";

export default function MainLayout() {
  return (
    <AppWrapper>
      <Header />
      <Outlet />
    </AppWrapper>
  );
}
