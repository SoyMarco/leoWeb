// Layouts
import LayoutForm from "Pages/Layout/Container/Layout";
import LayoutMobile from "Mobile/LayoutMobile/Container/LayoutMobile";

// Pages
import Principal from "Pages/Principal/container/Principal";
import Corte from "Pages/Corte/Container/Corte";

import Apartado from "Pages/Apartado/Container/Apartado";
import ErrorPage from "Pages/Error/Error";
import AddApartado from "Pages/AddApartado/Container/AddApartado";
import Caja from "Pages/Caja/Container/Caja";
import EntradasSalidas from "Pages/EntradasSalidas/Container/EntradasSalidas";
import CorteMobile from "Mobile/Corte/Container/Corte";
import VentaMobile from "Mobile/Ventas/Container/Ventas";
import AddEncargo from "Pages/Encargos/create/Container/Encargo";
import ReadEncargos from "Pages/Encargos/Encargos/container/ReadEncargos";
import UpdateEncargo from "Pages/Encargos/update/Container/Encargo";
import CorteB from "Mobile/CorteB/Container/CorteB";
import Ventas from "Pages/Ventas/Container/Ventas";
import Perfumes from "Pages/Perfumes/Container/Perfumes";

const routes = [
	{
		path: "/",
		layout: LayoutForm,
		component: Principal,
		exact: true,
	},
	{
		path: "/corte",
		layout: LayoutForm,
		component: Corte,
		exact: true,
	},
	// {
	// 	path: "/apartados",
	// 	layout: LayoutForm,
	// 	component: Apartados,
	// 	exact: true,
	// },
	{
		path: "/apartado/:folio",
		layout: LayoutForm,
		component: Apartado,
		exact: true,
	},
	{
		path: "/add",
		layout: LayoutForm,
		component: AddApartado,
		exact: true,
	},
	{
		path: "/caja",
		layout: LayoutForm,
		component: Caja,
		exact: true,
	},
	{
		path: "/perfumes",
		layout: LayoutForm,
		component: Perfumes,
		exact: true,
	},
	{
		path: "/entradasSalidas",
		layout: LayoutForm,
		component: EntradasSalidas,
		exact: true,
	},
	{
		path: "/addencargo",
		layout: LayoutForm,
		component: AddEncargo,
		exact: true,
	},
	{
		path: "/ventas",
		layout: LayoutForm,
		component: Ventas,
		exact: true,
	},
	{
		path: "/encargos",
		layout: LayoutForm,
		component: ReadEncargos,
		exact: true,
	},
	{
		path: "/encargo/:folio",
		layout: LayoutForm,
		component: UpdateEncargo,
		exact: true,
	},
	// Mobiles
	{
		path: "/mobile/corte",
		layout: LayoutMobile,
		component: CorteMobile,
		exact: true,
	},
	{
		path: "/mobile/corteB",
		layout: LayoutMobile,
		component: CorteB,
		exact: true,
	},
	{
		path: "/mobile/venta",
		layout: LayoutMobile,
		component: VentaMobile,
		exact: true,
	},
	{
		path: "/mobile/encargos",
		layout: LayoutMobile,
		component: ReadEncargos,
		exact: true,
	},
	{
		path: "/mobile/encargo/:folio",
		layout: LayoutMobile,
		component: UpdateEncargo,
		exact: true,
	},
	{
		path: "*",
		layout: LayoutForm,
		component: ErrorPage,
		exact: false,
	},
	// {
	// 	path: "/:username",
	// 	layout: Basic,
	// 	component: User,
	// 	exact: true,
	// },
];

export default routes;
