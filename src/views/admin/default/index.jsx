import React from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard, MdReceipt, MdAttachMoney, MdPending, MdCheckCircle, MdCancel, MdTrendingUp, MdOutlineCalendarToday, MdVisibility, MdFolder } from "react-icons/md";
import ProjectInvoicesModal from "components/modal/ProjectInvoicesModal";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";
import { proyectosService } from "services/proyectosService";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";

const Dashboard = () => {
  // Estado para el modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [selectedProjectInvoices, setSelectedProjectInvoices] = React.useState([]);

  // Estados para datos de proyectos
  const [proyectosActivos, setProyectosActivos] = React.useState([]);
  const [loadingProyectos, setLoadingProyectos] = React.useState(true);
  const [errorProyectos, setErrorProyectos] = React.useState(null);
  const [loadingFacturas, setLoadingFacturas] = React.useState(false);

  // Datos de ejemplo para el dashboard de facturas
  const dashboardData = {
    resumen: {
      total_facturas: 1250,
      monto_total: 450000000,
      facturas_pendientes: 45,
      facturas_pagadas: 1180,
      facturas_canceladas: 25,
      promedio_factura: 360000,
      facturas_mes_actual: 89,
      monto_mes_actual: 32000000,
      crecimiento_mensual: 12.5,
      crecimiento_anual: 8.3
    },
    facturas_por_mes: [
      { mes: "Ene", cantidad: 120, monto: 43000000, mes_completo: "Enero 2024" },
      { mes: "Feb", cantidad: 95, monto: 38000000, mes_completo: "Febrero 2024" },
      { mes: "Mar", cantidad: 110, monto: 42000000, mes_completo: "Marzo 2024" },
      { mes: "Abr", cantidad: 105, monto: 40000000, mes_completo: "Abril 2024" },
      { mes: "May", cantidad: 130, monto: 48000000, mes_completo: "Mayo 2024" },
      { mes: "Jun", cantidad: 125, monto: 46000000, mes_completo: "Junio 2024" },
      { mes: "Jul", cantidad: 140, monto: 52000000, mes_completo: "Julio 2024" },
      { mes: "Ago", cantidad: 135, monto: 50000000, mes_completo: "Agosto 2024" },
      { mes: "Sep", cantidad: 150, monto: 55000000, mes_completo: "Septiembre 2024" },
      { mes: "Oct", cantidad: 145, monto: 53000000, mes_completo: "Octubre 2024" },
      { mes: "Nov", cantidad: 160, monto: 58000000, mes_completo: "Noviembre 2024" },
      { mes: "Dic", cantidad: 155, monto: 56000000, mes_completo: "Diciembre 2024" }
    ],
    facturas_por_estado: [
      { estado: "Pagado", cantidad: 1180, monto: 420000000, porcentaje: 94.4 },
      { estado: "Pendiente", cantidad: 45, monto: 18000000, porcentaje: 3.6 },
      { estado: "Cancelado", cantidad: 25, monto: 12000000, porcentaje: 2.0 }
    ],
    top_proveedores: [
      { nombre: "Energía Solar S.A.", monto: 18000000, cantidad: 45, porcentaje: 15.2 },
      { nombre: "Paneles Plus", monto: 15000000, cantidad: 38, porcentaje: 12.8 },
      { nombre: "Solar Tech", monto: 12000000, cantidad: 32, porcentaje: 10.5 },
      { nombre: "Green Energy", monto: 9800000, cantidad: 28, porcentaje: 8.7 },
      { nombre: "Eco Solutions", monto: 8500000, cantidad: 25, porcentaje: 7.5 }
    ],
    metodos_pago: [
      { metodo: "Transferencia", cantidad: 850, monto: 320000000, porcentaje: 71.1 },
      { metodo: "Efectivo", cantidad: 200, monto: 75000000, porcentaje: 16.7 },
      { metodo: "Tarjeta", cantidad: 200, monto: 55000000, porcentaje: 12.2 }
    ],
    ultimas_facturas: [
      { id: 1, numero: "FAC-2024-001", proveedor: "Energía Solar S.A.", proyecto: "Instalación Residencial Villa del Sol", monto: 8500000, estado: "Pagado", fecha: "2024-01-15", metodo_pago: "Transferencia" },
      { id: 2, numero: "FAC-2024-002", proveedor: "Paneles Plus Ltda.", proyecto: "Sistema Comercial Centro Comercial", monto: 12500000, estado: "Pendiente", fecha: "2024-01-14", metodo_pago: "Efectivo" },
      { id: 3, numero: "FAC-2024-003", proveedor: "Solar Tech Industrial", proyecto: "Instalación Industrial Zona Franca", monto: 45000000, estado: "Pagado", fecha: "2024-01-13", metodo_pago: "Transferencia" },
      { id: 4, numero: "FAC-2024-004", proveedor: "Green Energy Solutions", proyecto: "Sistema Residencial Conjunto Cerrado", monto: 6800000, estado: "Pagado", fecha: "2024-01-12", metodo_pago: "Tarjeta" },
      { id: 5, numero: "FAC-2024-005", proveedor: "Eco Solutions Colombia", proyecto: "Instalación Comercial Oficinas", monto: 15800000, estado: "Pendiente", fecha: "2024-01-11", metodo_pago: "Efectivo" },
      { id: 6, numero: "FAC-2024-006", proveedor: "Renewable Power Corp", proyecto: "Sistema Industrial Planta de Producción", monto: 75000000, estado: "Cancelado", fecha: "2024-01-10", metodo_pago: "Transferencia" },
      { id: 7, numero: "FAC-2024-007", proveedor: "Solar Systems Pro", proyecto: "Instalación Residencial Casa Campestre", monto: 9200000, estado: "Pagado", fecha: "2024-01-09", metodo_pago: "Tarjeta" },
      { id: 8, numero: "FAC-2024-008", proveedor: "Clean Energy Ltda.", proyecto: "Sistema Comercial Restaurante", monto: 5500000, estado: "Pendiente", fecha: "2024-01-08", metodo_pago: "Efectivo" }
    ],
    proyectos_activos: [
      {
        id: 1,
        nombre: "Instalación Residencial Villa del Sol",
        descripcion: "Sistema de energía solar para conjunto residencial con 50 viviendas",
        estado: "Activo",
        total_gastado: 8500000,
        cantidad_facturas: 1
      },
      {
        id: 2,
        nombre: "Sistema Comercial Centro Comercial",
        descripcion: "Instalación de paneles solares para centro comercial en Medellín",
        estado: "Activo",
        total_gastado: 12500000,
        cantidad_facturas: 1
      },
      {
        id: 3,
        nombre: "Instalación Industrial Zona Franca",
        descripcion: "Sistema de energía solar para planta industrial en zona franca",
        estado: "Activo",
        total_gastado: 45000000,
        cantidad_facturas: 1
      },
      {
        id: 4,
        nombre: "Sistema Residencial Conjunto Cerrado",
        descripcion: "Implementación de energía solar para conjunto cerrado con 30 casas",
        estado: "Activo",
        total_gastado: 6800000,
        cantidad_facturas: 1
      },
      {
        id: 5,
        nombre: "Instalación Comercial Oficinas",
        descripcion: "Sistema solar para edificio de oficinas corporativas",
        estado: "Activo",
        total_gastado: 15800000,
        cantidad_facturas: 1
      },
      {
        id: 6,
        nombre: "Sistema Industrial Planta de Producción",
        descripcion: "Instalación de energía solar para planta de producción industrial",
        estado: "Activo",
        total_gastado: 75000000,
        cantidad_facturas: 1
      },
      {
        id: 7,
        nombre: "Instalación Residencial Casa Campestre",
        descripcion: "Sistema solar para casa campestre con alta demanda energética",
        estado: "Activo",
        total_gastado: 9200000,
        cantidad_facturas: 1
      },
      {
        id: 8,
        nombre: "Sistema Comercial Restaurante",
        descripcion: "Instalación de paneles solares para restaurante gourmet",
        estado: "Activo",
        total_gastado: 5500000,
        cantidad_facturas: 1
      }
    ]
  };

  const formatCurrency = (amount) => {
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' COP';
  };

  const formatCurrencyAbbreviated = (amount) => {
    if (amount >= 1000000000) {
      return '$' + new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount / 1000000000) + 'B COP';
    } else if (amount >= 1000000) {
      return '$' + new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount / 1000000) + 'M COP';
    } else {
      return '$' + new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount) + ' COP';
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CO').format(number);
  };

  // Función para abrir el modal con las facturas de un proyecto
  const handleViewProjectInvoices = async (project) => {
    try {
      setSelectedProject(project);
      setModalOpen(true);
      
      // Cargar las facturas del proyecto desde el backend
      const facturas = await cargarFacturasProyecto(project.id);
      setSelectedProjectInvoices(facturas);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      // Mostrar mensaje de error al usuario
      alert('Error al cargar las facturas del proyecto. Por favor, inténtalo de nuevo.');
      setModalOpen(false);
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
    setSelectedProjectInvoices([]);
  };

  // Función para cargar proyectos activos
  const cargarProyectosActivos = async () => {
    try {
      setLoadingProyectos(true);
      setErrorProyectos(null);
      const data = await proyectosService.getProyectosActivos();
      setProyectosActivos(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      setErrorProyectos('Error al cargar los proyectos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoadingProyectos(false);
    }
  };

  // Función para cargar facturas de un proyecto
  const cargarFacturasProyecto = async (proyectoId) => {
    try {
      setLoadingFacturas(true);
      const data = await proyectosService.getFacturasProyecto(proyectoId);
      return data;
    } catch (error) {
      console.error('Error al cargar facturas del proyecto:', error);
      throw error;
    } finally {
      setLoadingFacturas(false);
    }
  };

  // Cargar proyectos al montar el componente
  React.useEffect(() => {
    cargarProyectosActivos();
  }, []);

  // Configuración para gráficas
  const lineChartData = [
    {
      name: "Facturas",
      data: dashboardData.facturas_por_mes.map(item => item.cantidad)
    },
    {
      name: "Monto (M)",
      data: dashboardData.facturas_por_mes.map(item => item.monto / 1000000)
    }
  ];

  const lineChartOptions = {
    chart: {
      toolbar: { show: false },
    },
    tooltip: {
      style: { fontSize: "12px", backgroundColor: "#000000" },
      theme: "dark",
    },
    xaxis: {
      categories: dashboardData.facturas_por_mes.map(item => item.mes),
      labels: {
        style: { colors: "#A3AED0", fontSize: "14px", fontWeight: "500" },
      },
    },
    yaxis: [
      {
        title: { text: "Cantidad de Facturas" },
        labels: { style: { colors: "#A3AED0", fontSize: "14px" } },
      },
      {
        opposite: true,
        title: { text: "Monto (Millones)" },
        labels: { style: { colors: "#A3AED0", fontSize: "14px" } },
      }
    ],
    colors: ["#4318FF", "#6AD2FF"],
    grid: { strokeDashArray: 5 },
    dataLabels: { enabled: false },
  };

  const barChartDataProveedores = [
    {
      name: "Monto",
      data: dashboardData.top_proveedores.map(item => item.monto / 1000000),
      color: "#4318FF"
    }
  ];

  const barChartOptionsProveedores = {
    chart: {
      toolbar: { show: false },
    },
    tooltip: {
      style: { fontSize: "12px", backgroundColor: "#000000" },
      theme: "dark",
    },
    xaxis: {
      categories: dashboardData.top_proveedores.map(item => item.nombre),
      labels: {
        style: { colors: "#A3AED0", fontSize: "12px" },
        rotate: -45,
        rotateAlways: false
      },
    },
    yaxis: {
      title: { text: "Monto (Millones)" },
      labels: { style: { colors: "#A3AED0", fontSize: "14px" } },
    },
    grid: { strokeDashArray: 5 },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { borderRadius: 10, columnWidth: "40px" },
    },
  };

  const barChartDataMetodos = [
    {
      name: "Cantidad",
      data: dashboardData.metodos_pago.map(item => item.cantidad),
      color: "#6AD2FF"
    }
  ];

  const barChartOptionsMetodos = {
    chart: {
      toolbar: { show: false },
    },
    tooltip: {
      style: { fontSize: "12px", backgroundColor: "#000000" },
      theme: "dark",
    },
    xaxis: {
      categories: dashboardData.metodos_pago.map(item => item.metodo),
      labels: {
        style: { colors: "#A3AED0", fontSize: "14px" },
      },
    },
    yaxis: {
      title: { text: "Cantidad de Facturas" },
      labels: { style: { colors: "#A3AED0", fontSize: "14px" } },
    },
    grid: { strokeDashArray: 5 },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { borderRadius: 10, columnWidth: "40px" },
    },
  };

  const pieChartData = dashboardData.facturas_por_estado.map(item => item.porcentaje);
  const pieChartOptions = {
    labels: dashboardData.facturas_por_estado.map(item => item.estado),
    colors: ["#18981D", "#FFA500", "#FF0000"],
    chart: { width: "50px" },
    states: { hover: { filter: { type: "none" } } },
    legend: { show: false },
    dataLabels: { enabled: false },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: { labels: { show: false } },
      },
    },
    fill: { colors: ["#18981D", "#FFA500", "#FF0000"] },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: { fontSize: "12px", backgroundColor: "#000000" },
    },
  };

  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdReceipt className="h-7 w-7" />}
          title={"Total Facturas"}
          subtitle={formatNumber(dashboardData.resumen.total_facturas)}
        />
        <Widget
          icon={<MdAttachMoney className="h-6 w-6" />}
          title={"Monto Total"}
          subtitle={formatCurrencyAbbreviated(dashboardData.resumen.monto_total)}
        />
        <Widget
          icon={<MdPending className="h-7 w-7" />}
          title={"Facturas Pendientes"}
          subtitle={formatNumber(dashboardData.resumen.facturas_pendientes)}
        />
        <Widget
          icon={<MdCheckCircle className="h-6 w-6" />}
          title={"Facturas Pagadas"}
          subtitle={formatNumber(dashboardData.resumen.facturas_pagadas)}
        />
        <Widget
          icon={<MdCancel className="h-7 w-7" />}
          title={"Facturas Canceladas"}
          subtitle={formatNumber(dashboardData.resumen.facturas_canceladas)}
        />
        <Widget
          icon={<MdTrendingUp className="h-6 w-6" />}
          title={"Promedio por Factura"}
          subtitle={formatCurrencyAbbreviated(dashboardData.resumen.promedio_factura)}
        />
      </div>

      {/* Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Gráfica de líneas - Facturas por mes */}
        <Card extra="!p-[20px] text-center">
          <div className="flex justify-between">
            <button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
              <MdOutlineCalendarToday />
              <span className="text-sm font-medium text-gray-600">Últimos 12 meses</span>
            </button>
            <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
              <MdBarChart className="h-6 w-6" />
            </button>
          </div>

          <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
            <div className="flex flex-col">
              <p className="mt-[20px] text-3xl font-bold text-navy-700 dark:text-white">
                {formatNumber(dashboardData.resumen.facturas_mes_actual)}
              </p>
              <div className="flex flex-col items-start">
                <p className="mt-2 text-sm text-gray-600">Facturas este mes</p>
                <div className="flex flex-row items-center justify-center">
                  <MdTrendingUp className="font-medium text-green-500" />
                  <p className="text-sm font-bold text-green-500"> +{dashboardData.resumen.crecimiento_mensual}% </p>
                </div>
              </div>
            </div>
            <div className="h-full w-full">
              <LineChart options={lineChartOptions} series={lineChartData} />
            </div>
          </div>
        </Card>

        {/* Gráfica de barras - Top proveedores */}
        <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
          <div className="mb-auto flex items-center justify-between px-6">
            <h2 className="text-lg font-bold text-navy-700 dark:text-white">
              Top Proveedores
            </h2>
            <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
              <MdBarChart className="h-6 w-6" />
            </button>
          </div>

          <div className="md:mt-16 lg:mt-0">
            <div className="h-[250px] w-full xl:h-[350px]">
              <BarChart
                chartData={barChartDataProveedores}
                chartOptions={barChartOptionsProveedores}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Tables & Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Gráfica circular - Estados de facturas */}
        <Card extra="rounded-[20px] p-3">
          <div className="flex flex-row justify-between px-3 pt-2">
            <div>
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Estados de Facturas
              </h4>
            </div>
            <div className="mb-6 flex items-center justify-center">
              <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
                <option value="porcentaje">Por Porcentaje</option>
                <option value="cantidad">Por Cantidad</option>
                <option value="monto">Por Monto</option>
              </select>
            </div>
          </div>

          <div className="mb-auto flex h-[220px] w-full items-center justify-center">
            <PieChart options={pieChartOptions} series={pieChartData} />
          </div>
          
          <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            {dashboardData.facturas_por_estado.map((item, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <div 
                    className="h-2 w-2 rounded-full" 
                    style={{ backgroundColor: pieChartOptions.colors[index] }}
                  />
                  <p className="ml-1 text-sm font-normal text-gray-600">{item.estado}</p>
                </div>
                <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
                  {item.porcentaje}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Gráfica de barras - Métodos de pago */}
        <Card extra="pb-7 p-[20px]">
          <div className="flex flex-row justify-between">
            <div className="ml-1 pt-2">
              <p className="text-sm font-medium leading-4 text-gray-600">
                Métodos de Pago
              </p>
              <p className="text-[34px] font-bold text-navy-700 dark:text-white">
                {formatNumber(dashboardData.resumen.total_facturas)}{" "}
                <span className="text-sm font-medium leading-6 text-gray-600">
                  Facturas
                </span>
              </p>
            </div>
            <div className="mt-2 flex items-start">
              <div className="flex items-center text-sm text-green-500">
                <MdTrendingUp className="h-5 w-5" />
                <p className="font-bold"> +{dashboardData.resumen.crecimiento_anual}% </p>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full pt-10 pb-0">
            <BarChart
              chartData={barChartDataMetodos}
              chartOptions={barChartOptionsMetodos}
            />
          </div>
        </Card>
      </div>

      {/* Tabla de Facturas por Proyectos */}
      <div className="mt-5">
        <Card extra={"w-full h-full px-8 pb-8 sm:overflow-x-auto"}>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <MdFolder className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Facturas por Proyectos
              </h1>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            {loadingProyectos ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando proyectos...</span>
              </div>
            ) : errorProyectos ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{errorProyectos}</p>
                <button
                  onClick={cargarProyectosActivos}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : proyectosActivos.length === 0 ? (
              <div className="text-center py-8">
                <MdFolder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay proyectos activos con facturas</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Nombre del Proyecto</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Descripción</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Total Gastado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectosActivos.map((proyecto) => (
                    <tr key={proyecto.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">{proyecto.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{proyecto.descripcion}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">{formatCurrency(proyecto.total_gastado)}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <button
                          onClick={() => handleViewProjectInvoices(proyecto)}
                          disabled={loadingFacturas}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingFacturas ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Cargando...</span>
                            </>
                          ) : (
                            <>
                              <MdVisibility className="h-4 w-4" />
                              <span>Ver Facturas</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Modal para mostrar facturas del proyecto */}
      <ProjectInvoicesModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
        invoices={selectedProjectInvoices}
        loading={loadingFacturas}
      />
    </div>
  );
};

export default Dashboard;
