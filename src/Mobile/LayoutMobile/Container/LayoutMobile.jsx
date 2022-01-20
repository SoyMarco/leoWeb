import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./layout.css";
import "material-design-icons-iconfont";
import { openNotification } from "Utils/openNotification";
import { useHistory, useLocation } from "react-router-dom";
import Horizontal from "../Components/Horizontal";
import FooterHorizontal from "../Components/Footer";
import AuthContext from "context/Auth/AuthContext";

function LayoutForm({ children }) {
	// const [collapsed, setcollapsed] = useState(true);
	const { Header, Content, Footer } = Layout;
	const { auth, logout } = useContext(AuthContext);
	const [swtichstate, setswtichstate] = useState(true);
	// const [currentMenu, setcurrentMenu] = useState(1);
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
	// const onCollapse = () => {
	// 	setcollapsed(!collapsed);
	// 	let title = Location.pathname;
	// 	if (title === "/") {
	// 		document.querySelector("#inputPrecio").select();
	// 	}
	// };

	const logoutApp = () => {
		setswtichstate(!swtichstate);
		setTimeout(() => {
			logout();
			openNotification("success", "Espero verte pronto de nuevo.");
		}, 200);

		// setAuth(null);
	};
	// const handleClick = (e) => {
	// 	setcurrentMenu(e.key);
	// };
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

				{/* FOOTER HORIZONTAL*/}
				<Layout>
					<Layout>
						{/* CONTENIDO DE VENTAS */}
						<Content style={{ margin: "0 16px" }}>{children}</Content>

						<Footer
							style={{
								padding: 0,
								marginTop: "50px",
								width: "100%",
								position: "fixed",
								bottom: 0,
								// height: "200px",
							}}
						>
							<FooterHorizontal
								Header={Header}
								history={history}
								auth={auth}
								logoutApp={logoutApp}
								swtichstate={swtichstate}
							/>
						</Footer>
					</Layout>
				</Layout>
			</Layout>
		</>
	);
}

export default LayoutForm;
