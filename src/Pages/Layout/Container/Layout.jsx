import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import layoutVertical from "../Schemas/LayoutVertical";
import Horizontal from "../Components/Horizontal";
import { Layout, Menu } from "antd";

const LayoutForm = ({ children }) => {
	const [collapsed, setcollapsed] = useState(false);
	const { Content, Footer, Sider } = Layout;
	const navigate = useNavigate();
	const Location = useLocation();
	const screenWidth = window.screen.width;
	const [currentMenu, setcurrentMenu] = useState("1");
	const [titleWeb, settitleWeb] = useState(null);

	/* Cambiar titulo de pagina */
	useEffect(() => {
		changeLocation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Location]);

	const changeLocation = () => {
		const titleUrl = Location.pathname;
		const urlLocation = Location.pathname;
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
	};
	const onCollapse = () => {
		setcollapsed(!collapsed);
		const title = Location.pathname;
		if (title === "/") {
			document.querySelector("#inputPrecio").select();
		}
	};

	const handleClick = ({ key }) => {
		if (key === "NuevaVentana") {
			return;
		}
		setcurrentMenu(key);
		navigate(key);
	};

	return (
		<>
			{titleWeb ? <title>{titleWeb}</title> : null}

			<Layout
				style={{
					minHeight: "100vh",
					background: "linear-gradient(#004882, #004882, #004882)",
				}}
				className='site-layout'
			>
				{/* HORIZONTAL */}
				<Horizontal />

				<Layout>
					{screenWidth > 900 && (
						/* VERTICAL */
						<Sider
							collapsible
							collapsed={collapsed}
							onCollapse={onCollapse}
							breakpoint='lg'
						>
							<Menu
								mode='inline'
								onClick={(e) => handleClick(e)}
								selectedKeys={[currentMenu]}
								items={layoutVertical}
								style={{ color: "#004882", fontSize: "16px" }}
							/>
						</Sider>
					)}
					<Layout>
						{/* CONTENIDO DE VENTANAS*/}
						<Content style={{ margin: "5px" }}>{children}</Content>

						<Footer style={{ textAlign: "center" }}>
							Creado por MarcoASR ©2022
						</Footer>
					</Layout>
				</Layout>
			</Layout>
		</>
	);
};

export default LayoutForm;
