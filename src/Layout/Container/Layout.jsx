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
import { getToken, decodeToken, removeToken } from "../../Utils/token";
import { openNotification } from "../../Utils/openNotification";

import useAuth from "../../hooks/useAuth";

function LayoutForm() {
	const [collapsed, setcollapsed] = useState(false);
	const [modalCorte, setmodalCorte] = useState(false);
	const { Header, Content, Footer, Sider } = Layout;
	const { logout } = useAuth();
	const [swtichstate, setswtichstate] = useState(true);
	// console.log("@@@@@@@@auth", auth);
	// const { SubMenu } = Menu;
	const onCollapse = () => {
		setcollapsed(!collapsed);
		document.querySelector("#inputPrecio").select();
	};
	const handleModalCorte = () => {
		if (modalCorte === false) {
			document.querySelector("#inputPrecio").select();
		}
		setmodalCorte(!modalCorte);
	};
	const logoutApp = () => {
		setswtichstate(!swtichstate);
		setTimeout(() => {
			logout();
			openNotification("success", "Espero verte pronto de nuevo.");
		}, 200);

		// setAuth(null);
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
						defaultSelectedKeys={["2"]}
						style={{
							background: "transparent",
							margin: "-10px 0 0 0",
							// height: "50px",
							color: "white",
							width: "100%",
						}}
					>
						<Menu.Item
							key="1"
							style={{
								background: "transparent",
								margin: 0,
								padding: " 0 0 0 20px",
							}}
							icon={<Avatar src={LogoLeo} size="large" />}
						></Menu.Item>
						<Menu.Item
							key="1"
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
							key="2"
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
						<Menu.Item key="2" style={{ padding: "3px 0 0 15px" }}>
							<h1 style={{ color: "white", marginRight: 60 }}>Marco</h1>
						</Menu.Item>
						<Menu.Item key="3">
							{/* <h1></h1> */}
							<Popconfirm title="¿Cerrar sesión?" onConfirm={() => logoutApp()}>
								<Switch
									checked={swtichstate}
									style={
										swtichstate
											? {
													background: "blue",
													boxShadow:
														"5px 5px 19px #b3b3b3, -5px -5px 19px #ffffff",
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
				<Layout>
					<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
						<div className="logo" />
						<Menu defaultSelectedKeys={["2"]} mode="inline">
							<Menu.Item key="2" icon={<MdLocalGroceryStore />}>
								Vender
							</Menu.Item>

							<Menu.Item
								key="3"
								icon={<FaCashRegister />}
								onClick={handleModalCorte}
							>
								Corte
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Content style={{ margin: "0 16px" }}>
							<Principal />
						</Content>
						<Footer style={{ textAlign: "center" }}>
							Creado por MarcoASR ©2021
						</Footer>
					</Layout>
				</Layout>
			</Layout>
			<Corte
				modalCorte={modalCorte}
				handleModalCorte={handleModalCorte}
			></Corte>
		</div>
	);
}

export default LayoutForm;
