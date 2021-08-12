// Layouts

import LayoutForm from "../Layout/Container/Layout";

// Pages

const routes = [
	{
		path: "/",
		component: LayoutForm,
		exact: true,
	},
	// {
	// 	path: "/paciente",
	// 	layout: Basic,
	// 	component: TablaPacientes,
	// 	exact: true,
	// },
	// {
	// 	path: "/citas",
	// 	layout: Basic,
	// 	component: AddEditCita,
	// 	exact: true,
	// },
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
