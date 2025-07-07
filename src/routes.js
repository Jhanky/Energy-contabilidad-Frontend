import React from "react";
import { Navigate } from "react-router-dom";
import { MdDashboard, MdPerson, MdDescription, MdSolarPower, MdBatteryChargingFull, MdPeople, MdChat, MdDevices, MdInventory, MdBusiness, MdFolder, MdAccountBalance } from "react-icons/md";
import Main from "layouts/admin";
import SignIn from "views/auth/SignIn";
import ProtectedRoute from "components/ProtectedRoute";
import Unauthorized from "views/admin/unauthorized";
// Admin pages
import Dashboard from "views/admin/default";
import Facturas from "views/admin/facturas";
import Usuarios from "views/admin/usuarios";
import AgenteIA from "views/admin/agente-ia";
import Proveedores from "views/admin/proveedores";
import Proyectos from "views/admin/proyectos";
import CentrosCosto from "views/admin/centros-costo";

// Configuración de rutas sin componentes
const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    allowedRoles: ["admin", "comercial", "tecnico"]
  },
  {
    name: "Facturas",
    layout: "/admin",
    path: "facturas",
    icon: <MdDescription className="h-6 w-6" />,
    allowedRoles: ["admin", "comercial"]
  },
  {
    name: "Proveedores",
    layout: "/admin",
    path: "proveedores",
    icon: <MdBusiness className="h-6 w-6" />,
    allowedRoles: ["admin", "comercial"]
  },
  {
    name: "Centros de Costo",
    layout: "/admin",
    path: "centros-costo",
    icon: <MdAccountBalance className="h-6 w-6" />,
    allowedRoles: ["admin", "comercial"]
  },
  {
    name: "Proyectos",
    layout: "/admin",
    path: "proyectos",
    icon: <MdFolder className="h-6 w-6" />,
    allowedRoles: ["admin", "comercial", "tecnico"]
  },
  {
    name: "Usuarios",
    layout: "/admin",
    path: "usuarios",
    icon: <MdPeople className="h-6 w-6" />,
    allowedRoles: ["admin"]
  },
  {
    name: "Agente IA",
    layout: "/admin",
    path: "agente-ia",
    icon: <MdChat className="h-6 w-6" />,
    allowedRoles: ["admin", "comercial", "tecnico"]
  },
  
  
  {
    name: "Not Found",
    layout: "/404",
    path: "*",
    icon: <MdDashboard className="h-6 w-6" />
  },
];

// Rutas adicionales que no aparecen en el menú
export const additionalRoutes = [
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
  },
  {
    name: "Acceso Denegado",
    layout: "/admin",
    path: "unauthorized"
  }
];

export default routes;
