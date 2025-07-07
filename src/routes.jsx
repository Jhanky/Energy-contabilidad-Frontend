// import Cotizaciones from "views/admin/cotizaciones/index";
// import DetalleCotizacion from "views/admin/cotizaciones/[id]";

{
  name: "Cotizaciones",
  layout: "/admin",
  path: "cotizaciones",
  icon: <MdAttachMoney className="h-6 w-6" />,
  component: <Cotizaciones />,
},
{
  name: "Detalle Cotización",
  layout: "/admin",
  path: "cotizaciones/:id",
  icon: <MdAttachMoney className="h-6 w-6" />,
  component: <DetalleCotizacion />,
}, 