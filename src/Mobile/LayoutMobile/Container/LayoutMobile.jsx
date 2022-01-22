import React, { useState, useEffect, useContext } from "react";
import { Layout } from "antd";
import "antd/dist/antd.min.css";
import "./layout.css";
import { openNotification } from "Utils/openNotification";
import { useLocation } from "react-router-dom";
import Horizontal from "../Components/Horizontal";
import FooterHorizontal from "../Components/Footer";
import AuthContext from "context/Auth/AuthContext";

function LayoutForm({ children }) {
	const { Header, Content, Footer } = Layout;
	const { auth, logout } = useContext(AuthContext);
	const [swtichstate, setswtichstate] = useState(true);
	const [titleWeb, settitleWeb] = useState(null);
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

	const logoutApp = () => {
		setswtichstate(!swtichstate);
		setTimeout(() => {
			logout();
			openNotification("success", "Espero verte pronto de nuevo.");
		}, 200);
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
