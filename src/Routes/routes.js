// Layouts
import LayoutForm from "../Layout/Container/Layout";

// Pages
import Principal from "../Principal/container/Principal";
import Corte from "../Corte/Container/Corte";
import Apartados from "../Apartados/Container/Apartados";

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
	// {
	// 	path: "/:username",
	// 	layout: Basic,
	// 	component: User,
	// 	exact: true,
	// },
	// {
	// 	path: "/p/:username",
	// 	layout: Basic,
	// 	component: Paciente,
	// 	exact: true,
	// },

	// {
	// 	layout: LayoutBasic,
	// 	component: Error404,
	// },
];

export default routes;
