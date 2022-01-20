import React from "react";
import { Menu, Switch, Popconfirm, Tooltip, Avatar } from "antd";
import LogoLeo from "assets/png/logo.png";
import { useNavigate } from "react-router-dom";

export default function Horizontal({ Header, auth, logoutApp, swtichstate }) {
	let navigate = useNavigate();
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
						background: "transparent",
						margin: "-10px 0 0 0",
						color: "white",
						width: "100%",
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

					<Menu.Item key='header5' style={{ padding: "3px 0 0 15px" }}>
						<Tooltip
							placement='bottom'
							title={`HOLA ${auth?.name?.toUpperCase()}`}
						>
							<h1 style={{ color: "white", marginLeft: 30 }}>
								{auth.name.toUpperCase()}
							</h1>
						</Tooltip>
					</Menu.Item>
					<Menu.Item key='header6'>
						<Popconfirm title='¿Cerrar sesión?' onConfirm={() => logoutApp()}>
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
								defaultChecked
							></Switch>
						</Popconfirm>
					</Menu.Item>
				</Menu>
			</Header>
		</>
	);
}
