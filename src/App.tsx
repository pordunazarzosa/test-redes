import { HashRouter, Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import Inicio from "@/pages/Inicio";
import Configurar from "@/pages/Configurar";
import Examen from "@/pages/Examen";
import Resultados from "@/pages/Resultados";
import Historial from "@/pages/Historial";
import Importar from "@/pages/Importar";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="configurar" element={<Configurar />} />
          <Route path="examen" element={<Examen />} />
          <Route path="resultados" element={<Resultados />} />
          <Route path="historial" element={<Historial />} />
          <Route path="importar" element={<Importar />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
