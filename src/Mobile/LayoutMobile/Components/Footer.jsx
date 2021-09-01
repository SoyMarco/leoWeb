import React from "react";
import { Menu /* Switch, Popconfirm, Tooltip */ } from "antd";
// import { Avatar } from "antd";
// import LogoLeo from "assets/png/logo.png";
// import { FaUserAstronaut } from "react-icons/fa";
// import BuscadorApartados from "Pages/BuscadorApartados/Container/BuscadorApartados";
export default function Horizontal({
	Header,
	history,
	auth,
	logoutApp,
	swtichstate,
}) {
	return (
		<>
			{/* HORIZONTAL */}
			<Header
				style={{
					background: "white",
					margin: 0,
					height: "60px",
					color: "white",
					padding: 0,
				}}
			>
				<Menu
					mode='horizontal'
					style={{
						background: "transparent",
						margin: "-10px 0 0 0",
						// height: "50px",
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
						onClick={() => history.push("/")}
						// icon={<Avatar src={LogoLeo} size='large' />}
					></Menu.Item>
					<Menu.Item
						key='header2'
						onClick={() => history.push("/")}
						style={{
							padding: 0,
						}}
					></Menu.Item>
					{/* <Menu.Item
						key='header3'
						// onClick={() => history.push("/")}
						style={{
							background: "transparent",
							margin: "2px 40px",
						}}
					>
						{/* BUSCADOR RAPIDO DE APARTADOS */}
					{/*<BuscadorApartados />
					</Menu.Item> */}

					<Menu.Item
						key='header5'
						style={{ padding: "3px 0 0 15px" }}
					></Menu.Item>
					<Menu.Item key='header6'></Menu.Item>
				</Menu>
			</Header>
		</>
	);
}
