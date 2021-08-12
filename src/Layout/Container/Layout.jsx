import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Avatar } from "antd";
import "antd/dist/antd.css";
import Principal from "../../Principal/container/Principal";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa";
import "./layout.css";
import "material-design-icons-iconfont";
import LogoLeo from "../../assets/png/logo.png";
import Corte from "../../Corte/Container/Corte";

function LayoutForm() {
	const [collapsed, setcollapsed] = useState(false);
	const [modalCorte, setmodalCorte] = useState(false);
	const { Header, Content, Footer, Sider } = Layout;
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

	return (
		<div>
			<Layout
				style={{
					minHeight: "100vh",
					background: "linear-gradient(#0000a6, #000066)",
				}}
				className="site-layout"
			>
				<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
					<div className="logo" />
					<Menu defaultSelectedKeys={["2"]} mode="inline">
						<Menu.Item
							key="1"
							style={{
								background: "linear-gradient(#0000a6, #000066)",
								margin: 0,
								height: "50px",
								color: "white",
							}}
							icon={<Avatar src={LogoLeo} size="large" />}
						>
							Bazar Leo
						</Menu.Item>
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
					<Header
						className="site-layout-background"
						style={{
							padding: 0,
							height: "50px",
							background: "linear-gradient(#0000a6, #000066)",
						}}
					/>
					<Content style={{ margin: "0 16px" }}>
						<Principal />
					</Content>
					<Footer style={{ textAlign: "center" }}>
						Creado por MarcoASR ©2021
					</Footer>
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
