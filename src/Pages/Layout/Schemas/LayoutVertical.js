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
		label: "Principal",
	},
	{
		key: "/add",
		pathname: "/add",
		icon: <GiLargeDress />,
		label: "Nuevo Apartado",
	},
	{
		key: "/entradasSalidas",
		pathname: "/entradasSalidas",
		icon: <FaMoneyBillAlt />,
		label: "Entrada/Salida",
	},
	// {
	// 	key: "/Perfumes",
	// 	pathname: "/perfumes",
	// 	icon: <GiDelicatePerfume />,
	// 	label: "Perfumes",
	// },
	{
		key: "/ventas",
		pathname: "/ventas",
		icon: <FaFileInvoiceDollar />,
		label: "Ventas",
	},
	{
		key: "/corte",
		pathname: "/corte",
		icon: <FaCashRegister />,
		label: "Corte",
	},
	{
		key: "NuevaVentana",
		icon: <RiTerminalWindowFill />,
		label: (
			<a href='/' target='_blank' id='linkNewWindow'>
				<span>Nueva ventana</span>
			</a>
		),
	},
];

export default layoutVertical;
