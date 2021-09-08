import React from "react";
import { Row } from "antd";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa";

export default function Horizontal({ history }) {
	return (
		<>
			{/* HORIZONTAL */}
			<div
				style={{
					background: "white",
					margin: 0,
					height: "55px",
					// color: "white",
					padding: 0,
					fontSize: "xx-large",
				}}
			>
				<Row justify='space-between'>
					<FaCashRegister
						style={{
							margin: "10px 30px",
							color: "darkblue",
						}}
						onClick={() => history.push("/mobile/corte")}
					/>
					<MdLocalGroceryStore
						style={{
							margin: "10px 30px",
							color: "darkblue",
						}}
						onClick={() => history.push("/mobile/venta")}
					/>
				</Row>
			</div>
		</>
	);
}
