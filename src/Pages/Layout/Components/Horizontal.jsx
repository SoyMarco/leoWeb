import React, { useState } from "react";
import { Menu, Switch, Popconfirm, Tooltip } from "antd";
import { Avatar } from "antd";
import LogoLeo from "assets/png/logo.png";
import { FaUserAstronaut } from "react-icons/fa";
import BuscadorApartados from "Pages/BuscadorApartados/Container/BuscadorApartados";
import { SyncOutlined } from "@ant-design/icons";
import GetVentasMobile from "Pages/GetVentasMobile/Container/GetVentasMobile";

export default function Horizontal({
	Header,
	history,
	auth,
	logoutApp,
	swtichstate,
}) {
	const [spinMobile, setspinMobile] = useState(false);

	return (
		<>
			{/* GET VENTAS MOBILE */}
			<GetVentasMobile spinMobile={spinMobile} />

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
						// onClick={() => history.push("/")}
						style={{
							background: "transparent",
							margin: "2px 40px",
						}}
					>
						{/* BUSCADOR RAPIDO DE APARTADOS */}
						<BuscadorApartados />
					</Menu.Item>
					<Menu.Item
						key='headerMobile'
						// onClick={() => history.push("/")}
						style={{
							background: "transparent",
							margin: "2px 40px",
						}}
					>
						<Tooltip
							placement='bottom'
							title='Si esta activo puedes imprimir las ventas de Mobile más rapido'
						>
							<SyncOutlined
								style={{ fontSize: 25 }}
								spin={spinMobile}
								onClick={() => setspinMobile(!spinMobile)}
							/>
						</Tooltip>
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
		</>
	);
}
