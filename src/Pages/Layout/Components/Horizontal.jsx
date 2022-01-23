import React, { useContext } from "react";
import BuscadorApartados from "Pages/BuscadorApartados/Container/BuscadorApartados";
import { Menu, Switch, Popconfirm, Tooltip, Avatar } from "antd";
import { FaUserAstronaut } from "react-icons/fa";
import Estrellas from "./Estrellas/Estrellas";
import LogoLeo from "assets/png/logo.png";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Horizontal({ Header, logoutApp, swtichstate }) {
	let navigate = useNavigate();
	const { auth } = useContext(AuthContext);

	return (
		<>
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
						background: "linear-gradient(#000066, #000058, #000036)",
						margin: "-10px 0 0 0",
						height: "60px",
						color: "white",
						width: "100%",
						position: "fixed",
						zIndex: "2",
					}}
				>
					<Menu.Item
						key='header1'
						style={{
							background: "transparent",
							margin: 0,
							padding: " 0 0 0 20px",
						}}
						onClick={() => navigate("/")}
						icon={<Avatar src={LogoLeo} size='large' />}
					></Menu.Item>
					<Menu.Item
						key='header2'
						onClick={() => navigate("/")}
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
						// onClick={() => navigate("/")}
						style={{
							background: "transparent",
							margin: "2px 40px",
						}}
					>
						{/* BUSCADOR RAPIDO DE APARTADOS */}
						<BuscadorApartados />
					</Menu.Item>
					<Menu.Item
						key='star'
						style={{
							background: "transparent",
							margin: "0 0 0 100px",
						}}
					>
						<Estrellas />
					</Menu.Item>
					<Menu.Item
						key='header4'
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
					<Menu.Item key='header5' style={{ padding: "3px 0 0 15px" }}>
						<Tooltip
							placement='bottom'
							title={`HOLA ${auth?.name?.toUpperCase()}`}
						>
							<h1 style={{ color: "white", marginRight: 60 }}>
								{auth.name.toUpperCase()}
							</h1>
						</Tooltip>
					</Menu.Item>
					<Menu.Item key='header6'>
						{/* <h1></h1> */}
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
		</>
	);
}
