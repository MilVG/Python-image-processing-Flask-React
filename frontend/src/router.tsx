import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProcessImageView from "./views/ProcessImageView";
import AlgoritmoAView from "./views/AlgoritmoAView";
import JuegoPacmanView from "./views/JuegoPacmanView";
import PacmanEmojiView from "./views/PacmanEmojiView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<ProcessImageView />} index />
          <Route path="/Algoritmo-Estrella" element={<AlgoritmoAView />} index />
          <Route path="/Juego-Pacman" element={<JuegoPacmanView />} index />
          <Route path="/Pacman-Emoji" element={<PacmanEmojiView />} index />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
