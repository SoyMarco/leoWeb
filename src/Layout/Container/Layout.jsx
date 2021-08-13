import React, { useState } from "react";
import { Layout, Menu, Switch, Popconfirm } from "antd";
import { Avatar } from "antd";
import "antd/dist/antd.css";
import Principal from "../../Principal/container/Principal";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaCashRegister, FaUserAstronaut } from "react-icons/fa";
import "./layout.css";
import "material-design-icons-iconfont";
import LogoLeo from "../../assets/png/logo.png";
import Corte from "../../Corte/Container/Corte";
import { openNotification } from "../../Utils/openNotification";
import { useHistory, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function LayoutForm({ children }) {
	const [collapsed, setcollapsed] = useState(true);
	const { Header, Content, Footer, Sider } = Layout;
	const { logout } = useAuth();
	const [swtichstate, setswtichstate] = useState(true);
	const [currentMenu, setcurrentMenu] = useState(1);
	const history = useHistory();
	const Location = useLocation();

	// const { SubMenu } = Menu;
	const onCollapse = () => {
		setcollapsed(!collapsed);
		document.querySelector("#inputPrecio").select();
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
		console.log(Location);
		setcurrentMenu(e.key);
	};
	return (
		<div>
			<Layout
				style={{
					minHeight: "100vh",
					background: "linear-gradient(#0000A6,#000066,#000058)",
				}}
				className="site-layout"
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
						mode="horizontal"
						style={{
							background: "transparent",
							margin: "-10px 0 0 0",
							// height: "50px",
							color: "white",
							width: "100%",
						}}
					>
						<Menu.Item
							key="header1"
							style={{
								background: "transparent",
								margin: 0,
								padding: " 0 0 0 20px",
							}}
							onClick={() => history.push("/")}
							icon={<Avatar src={LogoLeo} size="large" />}
						></Menu.Item>
						<Menu.Item
							key="header2"
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
							key="header3"
							style={{
								display: "flex",
								flexDirection: "column",
								float: "right",
								marginLeft: "auto",
								padding: 0,
							}}
						>
							<FaUserAstronaut
								style={{
									color: "white",
									fontSize: "x-large",
									margin: "22px 0 0 0",
								}}
							/>
						</Menu.Item>
						<Menu.Item key="header4" style={{ padding: "3px 0 0 15px" }}>
							<h1 style={{ color: "white", marginRight: 60 }}>Marco</h1>
						</Menu.Item>
						<Menu.Item key="5">
							{/* <h1></h1> */}
							<Popconfirm title="¿Cerrar sesión?" onConfirm={() => logoutApp()}>
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
						<div className="logo" />
						<Menu
							mode="inline"
							onClick={handleClick}
							defaultOpenKeys={["sub1"]}
							selectedKeys={[currentMenu]}
						>
							<Menu.Item
								key="1"
								icon={<MdLocalGroceryStore />}
								onClick={() => history.push("/")}
							>
								Cuenta
							</Menu.Item>
							<Menu.Item
								key="2"
								icon={<FaCashRegister />}
								onClick={() => history.push("/corte")}
							>
								Corte
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						{/* Contenido de ventanas */}
						<Content style={{ margin: "0 16px" }}>{children}</Content>
						<Footer style={{ textAlign: "center" }}>
							Creado por MarcoASR ©2021
						</Footer>
					</Layout>
				</Layout>
			</Layout>
		</div>
	);
}

export default LayoutForm;
