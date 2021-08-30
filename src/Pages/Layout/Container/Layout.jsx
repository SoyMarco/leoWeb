import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaCashRegister, FaWindowRestore } from "react-icons/fa";
import { IoIosCash } from "react-icons/io";
import "./layout.css";
import "material-design-icons-iconfont";
import { openNotification } from "Utils/openNotification";
import { useHistory, useLocation, Link } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { UrlFrontend } from "config/apollo";
import { GiLargeDress } from "react-icons/gi";
import { RiFileSearchFill } from "react-icons/ri";
import Horizontal from "../Components/Horizontal";

function LayoutForm({ children }) {
	const [collapsed, setcollapsed] = useState(true);
	const { Header, Content, Footer, Sider } = Layout;
	const { logout, auth } = useAuth();
	const [swtichstate, setswtichstate] = useState(true);
	const [currentMenu, setcurrentMenu] = useState(1);
	const [titleWeb, settitleWeb] = useState(null);
	const history = useHistory();
	const Location = useLocation();
	/* Cambiar titulo de pagina */
	useEffect(() => {
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
							onClick={() => handleClick}
							defaultOpenKeys={["sub1"]}
							selectedKeys={[currentMenu]}
						>
							<Menu.Item
								key='1'
								icon={
									<Link
										to={{
											pathname: `/`,
										}}
									>
										<MdLocalGroceryStore style={{ color: "darkblue" }} />
									</Link>
								}
								onClick={() => history.push("/")}
							>
								Cuenta
							</Menu.Item>
							<Menu.Item
								key='2'
								icon={
									<Link
										to={{
											pathname: `/corte`,
										}}
									>
										<FaCashRegister style={{ color: "darkblue" }} />
									</Link>
								}
								onClick={() => history.push("/corte")}
							>
								Corte
							</Menu.Item>
							<Menu.Item
								key='3'
								icon={
									<Link
										to={{
											pathname: `/add`,
										}}
									>
										<GiLargeDress style={{ color: "darkblue" }} />
									</Link>
								}
								onClick={() => history.push("/add")}
							>
								Nuevo Apartado
							</Menu.Item>
							{/* <Menu.Item
								key='4'
								icon={
									<Link
										to={{
											pathname: `/apartados`,
										}}
									>
										<RiFileSearchFill style={{ color: "darkblue" }} />
									</Link>
								}
								onClick={() => history.push("/apartados")}
							>
								Buscar Apartados
							</Menu.Item> */}
							<Menu.Item
								key='5'
								icon={
									<Link
										to={{
											pathname: `/entradasSalidas`,
										}}
									>
										<IoIosCash style={{ color: "darkblue" }} />
									</Link>
								}
								onClick={() => history.push("/entradasSalidas")}
							>
								Entradas / Salidas
							</Menu.Item>
							<Menu.Item
								key='7'
								icon={<FaWindowRestore style={{ color: "darkblue" }} />}
								onClick={() => window.open(UrlFrontend)}
							>
								Nueva ventana
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
