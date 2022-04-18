import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { openNotification } from "Utils/openNotification";
import Horizontal from "../Components/Horizontal";
import { Layout, Menu } from "antd";
import "antd/dist/antd.min.css";
import "./layout.css";
import AuthContext from "context/Auth/AuthContext";
import layoutVertical from "../Schemas/LayoutVertical";

function LayoutForm({ children }) {
	const { auth, logout } = useContext(AuthContext);
	const [collapsed, setcollapsed] = useState(false);
	const { Header, Content, Footer, Sider } = Layout;
	let navigate = useNavigate();
	const Location = useLocation();
	const screenWidth = window.screen.width;
	const [swtichstate, setswtichstate] = useState(true);
	const [currentMenu, setcurrentMenu] = useState("1");
	const [titleWeb, settitleWeb] = useState(null);

	/* Cambiar titulo de pagina */
	useEffect(() => {
		changeLocation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Location]);

	const changeLocation = () => {
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
	};
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
			navigate("/");
		}, 200);
	};
	const handleClick = (e) => {
		if (e.key === "NuevaVentana") {
			return;
		}
		setcurrentMenu(e.key);
	};

	const navVertical = (item) => {
		if (item.pathname) {
			navigate(item.pathname);
		}
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
					auth={auth}
					logoutApp={logoutApp}
					swtichstate={swtichstate}
				/>

				{/* VERTICAL */}

				<Layout>
					{screenWidth > 900 && (
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
							>
								{layoutVertical.map((item) => (
									<Menu.Item
										key={item.key}
										onClick={() => navVertical(item)}
										icon={item.icon}
										className='iconLayoutV'
									>
										{item.title}
									</Menu.Item>
								))}
							</Menu>
						</Sider>
					)}
					<Layout>
						{/* CONTENIDO DE VENTANAS*/}
						<Content style={{ margin: "5px" }}>{children}</Content>

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
