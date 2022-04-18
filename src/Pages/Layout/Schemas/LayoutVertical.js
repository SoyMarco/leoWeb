import { MdLocalGroceryStore } from "react-icons/md";
import {
	FaCashRegister,
	FaMoneyBillAlt,
	FaFileInvoiceDollar,
} from "react-icons/fa";
import { RiTerminalWindowFill } from "react-icons/ri";
import { GiLargeDress } from "react-icons/gi";

const layoutVertical = [
	{
		key: "/",
		pathname: "/",
		icon: <MdLocalGroceryStore />,
		title: "Principal",
	},
	{
		key: "/add",
		pathname: "/add",
		icon: <GiLargeDress />,
		title: "Nuevo Apartado",
	},
	{
		key: "/entradasSalidas",
		pathname: "/entradasSalidas",
		icon: <FaMoneyBillAlt />,
		title: "Entrada/Salida",
	},
	// {
	// 	key: "/Perfumes",
	// 	pathname: "/perfumes",
	// 	icon: <GiDelicatePerfume />,
	// 	title: "Perfumes",
	// },
	{
		key: "/ventas",
		pathname: "/ventas",
		icon: <FaFileInvoiceDollar />,
		title: "Ventas",
	},
	{
		key: "/corte",
		pathname: "/corte",
		icon: <FaCashRegister />,
		title: "Corte",
	},
	{
		key: "NuevaVentana",
		icon: <RiTerminalWindowFill />,
		title: (
			<a href='/' target='_blank' id='linkNewWindow'>
				<span>Nueva ventana</span>
			</a>
		),
	},
];

export default layoutVertical;
