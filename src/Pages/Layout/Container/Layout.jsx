import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaCashRegister, FaMoneyBillAlt /* FaBook  */ } from "react-icons/fa";
import { RiTerminalWindowFill } from "react-icons/ri";
import "./layout.css";
import "material-design-icons-iconfont";
import { openNotification } from "Utils/openNotification";
import { useHistory, useLocation, Link } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { UrlFrontend } from "config/apollo";
import { GiLargeDress } from "react-icons/gi";
import Horizontal from "../Components/Horizontal";

function LayoutForm({ children }) {
	const [collapsed, setcollapsed] = useState(true);
	const { Header, Content, Footer, Sider } = Layout;
	const { logout, auth } = useAuth();
	const history = useHistory();
	const Location = useLocation();

	const [swtichstate, setswtichstate] = useState(true);
	const [currentMenu, setcurrentMenu] = useState("1");
	const [titleWeb, settitleWeb] = useState(null);

	/* Cambiar titulo de pagina */
	useEffect(() => {
		let titleUrl = Location.pathname;

		let apartado = Location.pathname;
		apartado = apartado.slice(0, 10);
		if (Location.pathname === "/") {
			settitleWeb(null);
		} else if (apartado === "/apartado/") {
			settitleWeb(null);
		} else if (apartado === "/add") {
			settitleWeb(null);
		} else {
			let title = Location.pathname;
			title = title.toUpperCase();
			title = title.replace(/^./, "");
			settitleWeb(title);
		}
		setcurrentMenu(titleUrl);
	}, [Location]);

	// const { SubMenu } = Menu;
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
		}, 200);

		// setAuth(null);
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
					background: "linear-gradient(#0000A6,#000066,#000058)",
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
						<div className='logo' />
						<Menu
							mode='inline'
							onClick={(e) => handleClick(e)}
							// defaultOpenKeys={[currentMenu]}
							selectedKeys={[currentMenu]}
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
											style={{ color: "darkblue", fontSize: "25px" }}
										/>
									</Link>
								}
								onClick={() => history.push("/")}
							>
								<h2>Cuenta</h2>
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
											style={{ color: "darkblue", fontSize: "25px" }}
										/>
									</Link>
								}
								onClick={() => history.push("/corte")}
							>
								<h2>Corte</h2>
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
											style={{ color: "darkblue", fontSize: "25px" }}
										/>
									</Link>
								}
								onClick={() => history.push("/add")}
							>
								<h3>Nuevo Apartado</h3>
							</Menu.Item>

							<Menu.Item
								key='/entradasSalidas'
								icon={
									<Link
										to={{
											pathname: `/entradasSalidas`,
										}}
									>
										<FaMoneyBillAlt
											style={{ color: "darkblue", fontSize: "25px" }}
										/>
									</Link>
								}
								onClick={() => history.push("/entradasSalidas")}
							>
								<h3>Entradas / Salidas</h3>
							</Menu.Item>
							{/* <Menu.Item
								key='/encargo'
								icon={
									<Link
										to={{
											pathname: `/encargo`,
										}}
									>
										<FaBook
											style={{
												color: "darkblue",
												fontSize: "25px",
											}}
										/>
									</Link>
								}
								onClick={() => history.push("/encargo")}
							>
								<h2>Encargos</h2>
							</Menu.Item> */}
							<Menu.Item
								key='7'
								icon={
									<RiTerminalWindowFill
										style={{ color: "darkblue", fontSize: "30px" }}
									/>
								}
								onClick={() => window.open(UrlFrontend)}
							>
								<h3>Nueva ventana</h3>
							</Menu.Item>
						</Menu>
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
