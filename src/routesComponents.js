import React from "react";
import { Navigate } from "react-router-dom";
import Main from "layouts/admin";
import SignIn from "views/auth/SignIn";
import Unauthorized from "views/admin/unauthorized";
import Dashboard from "views/admin/default";
import Facturas from "views/admin/facturas";
import Usuarios from "views/admin/usuarios";
import AgenteIA from "views/admin/agente-ia";
import Proveedores from "views/admin/proveedores";
import Proyectos from "views/admin/proyectos";
import CentrosCosto from "views/admin/centros-costo";

// Mapeo de rutas a componentes
export const routeComponents = {
  "sign-in": <SignIn />,
  "default": <Dashboard />,
  "facturas": <Facturas />,
  "usuarios": <Usuarios />,
  "agente-ia": <AgenteIA />,
  "unauthorized": <Unauthorized />,
  "proveedores": <Proveedores />,
  "proyectos": <Proyectos />,
  "centros-costo": <CentrosCosto />,
  "*": <Navigate to="/404" />
};

export default routeComponents; 