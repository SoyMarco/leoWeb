// Layouts
import LayoutForm from "Pages/Layout/Container/Layout";

// Pages
import Principal from "Pages/Principal/container/Principal";
import Corte from "Pages/Corte/Container/Corte";
import Apartados from "Pages/Apartados/Container/Apartados";
import Apartado from "Pages/Apartado/Container/Apartado";
import Error from "Pages/Error/Error";
import Prueba from "Pages/prueba";
import AddApartado from "Pages/AddApartado/Container/AddApartado";
import Caja from "Pages/Caja/Container/Caja";
import EntradasSalidas from "Pages/EntradasSalidas/Container/EntradasSalidas";
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
	{
		path: "/apartados",
		layout: LayoutForm,
		component: Apartados,
		exact: true,
	},
	{
		path: "/apartado/:folio",
		layout: LayoutForm,
		component: Apartado,
		exact: true,
	},
	{
		path: "/prueba",
		layout: LayoutForm,
		component: Prueba,
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
		path: "/entradasSalidas",
		layout: LayoutForm,
		component: EntradasSalidas,
		exact: true,
	},
	{
		layout: LayoutForm,
		component: Error,
	},
	// {
	// 	path: "/:username",
	// 	layout: Basic,
	// 	component: User,
	// 	exact: true,
	// },
];

export default routes;
