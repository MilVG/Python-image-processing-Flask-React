import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProcessImageView from "./views/ProcessImageView";
import AlgoritmoAView from "./views/AlgoritmoAView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<ProcessImageView />} index />
          <Route path="/Algoritmo-Estrella" element={<AlgoritmoAView />} index />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
