import { MdLocalGroceryStore } from "react-icons/md";
import {
	FaCashRegister,
	FaMoneyBillAlt,
	FaFileInvoiceDollar,
} from "react-icons/fa";
import { RiTerminalWindowFill } from "react-icons/ri";
import { GiLargeDress, GiNotebook } from "react-icons/gi";
// Logo caja
// import { GiNotebook } from "react-icons/go";
const layoutVertical = [
	{
		key: "/",
		icon: <MdLocalGroceryStore style={{ fontSize: "23px" }} />,
		label: "Principal",
	},
	{
		key: "/add",
		icon: <GiLargeDress style={{ fontSize: "23px" }} />,
		label: "Nuevo Apartado",
	},
	{
		key: "/addencargo",
		icon: <GiNotebook style={{ fontSize: "23px" }} />,
		label: "Nuevo Encargo",
	},
	// {
	// 	key: "/encargos",
	// 	icon: <GiNotebook style={{ fontSize: "23px" }} />,
	// 	label: "Ver Encargos",
	// },
	{
		key: "/entradasSalidas",
		icon: <FaMoneyBillAlt style={{ fontSize: "23px" }} />,
		label: "Entrada/Salida",
	},
	// {
	// 	key: "/Perfumes",
	// 	icon: <GiDelicatePerfume />,
	// 	label: "Perfumes",
	// },
	{
		key: "/ventas",
		icon: <FaFileInvoiceDollar style={{ fontSize: "23px" }} />,
		label: "Ventas",
	},
	{
		key: "/corte",
		icon: <FaCashRegister style={{ fontSize: "23px" }} />,
		label: "Corte",
	},
	{
		key: "NuevaVentana",
		icon: <RiTerminalWindowFill style={{ fontSize: "23px" }} />,
		label: (
			<a href='/' target='_blank' id='linkNewWindow'>
				<span>Nueva ventana</span>
			</a>
		),
	},
];

export default layoutVertical;
