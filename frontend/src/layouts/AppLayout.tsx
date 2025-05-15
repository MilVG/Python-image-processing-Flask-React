import { Outlet } from "react-router-dom";
import { Navbar } from "../components/elements/Navbar";

export default function AppLayout() {

  return (
    <>
      <Navbar />

      <section className=" h-auto w-full">
        <Outlet />
      </section>
    </>
  )
}

