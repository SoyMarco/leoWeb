import { useContext, useState } from "react";
import BuscadorApartados from "Pages/BuscadorApartados/Container/BuscadorApartados";
import { Layout, Switch, Popconfirm, Tooltip, Avatar, Row, Col } from "antd";
import { openNotification } from "Utils/openNotification";
import AuthContext from "context/Auth/AuthContext";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Estrellas from "./Estrellas/Estrellas";
import LogoLeo from "assets/png/logo.png";

export default function Horizontal() {
	const { logout } = useContext(AuthContext);

	const navigate = useNavigate();
	const { auth } = useContext(AuthContext);
	const { Header } = Layout;

	const [swtichstate, setswtichstate] = useState(true);

	const logoutApp = () => {
		setswtichstate(!swtichstate);
		setTimeout(() => {
			logout();
			openNotification("success", "Espero verte pronto de nuevo.");
			navigate("/");
		}, 200);
	};
	return (
		<Header
			style={{
				background: "linear-gradient(#000066, #000058, #000036)",
				margin: 0,
				height: "50px",
				color: "white",
				padding: 0,
			}}
		>
			<Row
				style={{
					margin: "-10px 0 0 0",
					height: "60px",
					width: "100%",
				}}
				justify='space-between'
			>
				<Col xs={0} md={0} lg={3} onClick={() => navigate("/")}>
					<Row>
						<Col>
							<Avatar src={LogoLeo} size='large' />
						</Col>
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
					</Row>
				</Col>
				<Col xs={20} md={20} lg={9} style={{ marginTop: "5px" }}>
					<BuscadorApartados />
				</Col>
				<Col xs={0} md={0} lg={2}>
					<Estrellas />
				</Col>
				<Col xs={0} md={0} lg={2}>
					<Tooltip
						placement='bottom'
						title={`HOLA ${auth?.name?.toUpperCase()}`}
					>
						<Row>
							<FaUserAstronaut
								style={{
									color: "white",
									fontSize: "x-large",
									margin: "22px 0 0 0",
								}}
							/>
							<h1 style={{ color: "white", marginLeft: 10 }}>
								{auth?.name?.toUpperCase()}
							</h1>
						</Row>
					</Tooltip>
				</Col>

				<Col md={2} lg={1}>
					<Popconfirm
						title='¿Cerrar sesión?'
						onConfirm={() => logoutApp()}
						placement='bottomRight'
					>
						<Switch
							checked={swtichstate}
							style={
								swtichstate
									? {
											background: "linear-gradient(#2196F3,#0000E6)",
											boxShadow: "5px 5px 29px #b3b3b3, -5px -5px 29px #ffffff",
									  }
									: {
											background: "red",
									  }
							}
							defaultChecked
						></Switch>
					</Popconfirm>
				</Col>
			</Row>
		</Header>
	);
}
