import React, { useState, useEffect } from "react";
import { Layout, Menu, Switch, Popconfirm, Tooltip } from "antd";
import { Avatar } from "antd";
import "antd/dist/antd.css";
import { MdLocalGroceryStore } from "react-icons/md";
import {
	FaCashRegister,
	FaUserAstronaut,
	FaWindowRestore,
} from "react-icons/fa";
import "./layout.css";
import "material-design-icons-iconfont";
import LogoLeo from "assets/png/logo.png";
import { openNotification } from "Utils/openNotification";
import { useHistory, useLocation, Link } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { UrlFrontend } from "config/apollo";
import { GiLargeDress } from "react-icons/gi";

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
		console.log("apartado", apartado);
		if (Location.pathname === "/") {
			settitleWeb(null);
		} else if (apartado === "/apartado/") {
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
		console.log(e);
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
				<Header
					style={{
						background: "linear-gradient(#0000A6,#000066,#000058)",
						margin: 0,
						height: "50px",
						color: "white",
						padding: 0,
					}}
				>
					<Menu
						mode='horizontal'
						style={{
							background: "transparent",
							margin: "-10px 0 0 0",
							// height: "50px",
							color: "white",
							width: "100%",
						}}
					>
						<Menu.Item
							key='header1'
							style={{
								background: "transparent",
								margin: 0,
								padding: " 0 0 0 20px",
							}}
							onClick={() => history.push("/")}
							icon={<Avatar src={LogoLeo} size='large' />}
						></Menu.Item>
						<Menu.Item
							key='header2'
							onClick={() => history.push("/")}
							style={{
								padding: 0,
							}}
						>
							<h1
								style={{
									background: "transparent",
									margin: 0,
									color: "white",
									padding: 0,
								}}
							>
								Bazar Leo
							</h1>
						</Menu.Item>
						<Menu.Item
							key='header3'
							style={{
								display: "flex",
								flexDirection: "column",
								float: "right",
								marginLeft: "auto",
								padding: 0,
							}}
						>
							<Tooltip
								placement='bottom'
								title={`HOLA ${auth?.name?.toUpperCase()}`}
							>
								<FaUserAstronaut
									style={{
										color: "white",
										fontSize: "x-large",
										margin: "22px 0 0 0",
									}}
								/>
							</Tooltip>
						</Menu.Item>
						<Menu.Item key='header4' style={{ padding: "3px 0 0 15px" }}>
							<Tooltip
								placement='bottom'
								title={`HOLA ${auth?.name?.toUpperCase()}`}
							>
								<h1 style={{ color: "white", marginRight: 60 }}>
									{auth.name.toUpperCase()}
								</h1>
							</Tooltip>
						</Menu.Item>
						<Menu.Item key='5'>
							{/* <h1></h1> */}
							<Popconfirm title='¿Cerrar sesión?' onConfirm={() => logoutApp()}>
								<Switch
									checked={swtichstate}
									style={
										swtichstate
											? {
													background: "blue",
													boxShadow:
														"5px 5px 29px #b3b3b3, -5px -5px 29px #ffffff",
											  }
											: {
													background: "red", // boxShadow: "5px 5px 19px #b3b3b3, -5px -5px 19px #ffffff",
											  }
									}
									// onChange={logoutApp}
									defaultChecked
								></Switch>
							</Popconfirm>
						</Menu.Item>
					</Menu>
				</Header>

				{/* VERTICAL */}
				<Layout>
					<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
						<div className='logo' />
						<Menu
							mode='inline'
							onClick={handleClick}
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
											pathname: `/apartados`,
										}}
									>
										<GiLargeDress style={{ color: "darkblue" }} />
									</Link>
								}
								onClick={() => history.push("/apartados")}
							>
								Apartados
							</Menu.Item>
							<Menu.Item
								key='4'
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
