import React, { useState, useEffect, useContext } from "react";
import { GiLargeDress /* , GiOpenBook  */ } from "react-icons/gi";
import { useHistory, useLocation, Link } from "react-router-dom";
import {
	FaCashRegister,
	FaMoneyBillAlt,
	FaFileInvoiceDollar,
} from "react-icons/fa";
import { openNotification } from "Utils/openNotification";
import { RiTerminalWindowFill } from "react-icons/ri";
import { MdLocalGroceryStore } from "react-icons/md";
import Horizontal from "../Components/Horizontal";
import "material-design-icons-iconfont";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import "./layout.css";
import AuthContext from "context/Auth/AuthContext";

function LayoutForm({ children }) {
	const { auth, logout } = useContext(AuthContext);
	const [collapsed, setcollapsed] = useState(false);
	const { Header, Content, Footer, Sider } = Layout;
	const history = useHistory();
	const Location = useLocation();

	const [swtichstate, setswtichstate] = useState(true);
	const [currentMenu, setcurrentMenu] = useState("1");
	const [titleWeb, settitleWeb] = useState(null);

	/* Cambiar titulo de pagina */
	useEffect(() => {
		let titleUrl = Location.pathname;

		let urlLocation = Location.pathname;
		let apartado = "";
		let encargo = "";
		apartado = urlLocation.slice(0, 10);
		encargo = urlLocation.slice(0, 9);
		if (Location.pathname === "/") {
			settitleWeb(null);
		} else if (apartado === "/apartado/") {
			settitleWeb(null);
		} else if (urlLocation === "/add") {
			settitleWeb(null);
		} else if (encargo === "/encargo/") {
			settitleWeb(null);
		} else {
			let title = Location.pathname;
			title = title.toUpperCase();
			title = title.replace(/^./, "");
			settitleWeb(title);
		}
		setcurrentMenu(titleUrl);
	}, [Location]);

	const onCollapse = () => {
		setcollapsed(!collapsed);
		let title = Location.pathname;
		if (title === "/") {
			document.querySelector("#inputPrecio").select();
		}
	};

	const logoutApp = () => {
		setswtichstate(!swtichstate);
		setTimeout(() => {
			logout();
			openNotification("success", "Espero verte pronto de nuevo.");
			history.push("/");
		}, 200);
	};
	const handleClick = (e) => {
		setcurrentMenu(e.key);
	};
	return (
		<>
			{titleWeb ? <title>{titleWeb}</title> : null}

			{/* LAYOUT ESCRITORIO */}
			<Layout
				style={{
					minHeight: "100vh",
					background: "linear-gradient(#004882, #004882, #004882)",
				}}
				className='site-layout'
			>
				{/* HORIZONTAL */}
				<Horizontal
					Header={Header}
					history={history}
					auth={auth}
					logoutApp={logoutApp}
					swtichstate={swtichstate}
				/>

				{/* VERTICAL */}
				<Layout>
					<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
						<div>
							<Menu
								mode='inline'
								onClick={(e) => handleClick(e)}
								selectedKeys={[currentMenu]}
								// onMouseOver={() => setcollapsed(false)}
								// onMouseLeave={() => setcollapsed(true)}
							>
								<Menu.Item
									key='/'
									icon={
										<Link
											to={{
												pathname: `/`,
											}}
										>
											<MdLocalGroceryStore
												style={{ color: "#004882", fontSize: "25px" }}
											/>
										</Link>
									}
									onClick={() => history.push("/")}
								>
									<h2>Cuenta</h2>
								</Menu.Item>
								<Menu.Item
									key='/add'
									icon={
										<Link
											to={{
												pathname: `/add`,
											}}
										>
											<GiLargeDress
												style={{ color: "#004882", fontSize: "25px" }}
											/>
										</Link>
									}
									onClick={() => history.push("/add")}
								>
									<h3>Nuevo Apartado</h3>
								</Menu.Item>
								{/* <Menu.Item
									key='/addencargo'
									icon={
										<Link
											to={{
												pathname: `/addencargo`,
											}}
										>
											<FaPencilAlt
												style={{
													color: "#004882",
													fontSize: "25px",
												}}
											/>
										</Link>
									}
									onClick={() => history.push("/addencargo")}
								>
									<h3>Nuevo Encargo</h3>
								</Menu.Item>
								<Menu.Item
									key='/encargos'
									icon={
										<Link
											to={{
												pathname: `/encargos`,
											}}
										>
											<GiOpenBook
												style={{
													color: "#004882",
													fontSize: "25px",
												}}
											/>
										</Link>
									}
									onClick={() => history.push("/encargos")}
								>
									<h3>Encargos</h3>
								</Menu.Item> */}
								<Menu.Item
									key='/entradasSalidas'
									icon={
										<Link
											to={{
												pathname: `/entradasSalidas`,
											}}
										>
											<FaMoneyBillAlt
												style={{ color: "#004882", fontSize: "25px" }}
											/>
										</Link>
									}
									onClick={() => history.push("/entradasSalidas")}
								>
									<h3>Entrada / Salida</h3>
								</Menu.Item>
								<Menu.Item
									key='/ventas'
									icon={
										<Link
											to={{
												pathname: `/ventas`,
											}}
										>
											<FaFileInvoiceDollar
												style={{ color: "#004882", fontSize: "25px" }}
											/>
										</Link>
									}
									onClick={() => history.push("/ventas")}
								>
									<h2>Ventas</h2>
								</Menu.Item>
								<Menu.Item
									key='/corte'
									icon={
										<Link
											to={{
												pathname: `/corte`,
											}}
										>
											<FaCashRegister
												style={{ color: "#004882", fontSize: "25px" }}
											/>
										</Link>
									}
									onClick={() => history.push("/corte")}
								>
									<h2>Corte</h2>
								</Menu.Item>
								<Menu.Item
									key='7'
									icon={
										<RiTerminalWindowFill
											style={{ color: "#004882", fontSize: "30px" }}
										/>
									}
								>
									<a href='/' target='_blank' id='linkNewWindow'>
										<h3>Nueva ventana</h3>
									</a>
								</Menu.Item>
							</Menu>
						</div>
					</Sider>
					<Layout>
						{/* CONTENIDO DE VENTAS */}
						<Content style={{ margin: "0 16px" }}>{children}</Content>

						<Footer style={{ textAlign: "center" }}>
							Creado por MarcoASR ©2021
						</Footer>
					</Layout>
				</Layout>
			</Layout>
		</>
	);
}

export default LayoutForm;
