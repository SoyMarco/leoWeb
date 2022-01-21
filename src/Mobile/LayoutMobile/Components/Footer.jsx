import React from "react";
import { Row } from "antd";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Horizontal() {
	let navigate = useNavigate();

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
				<Row justify='space-around'>
					<FaCashRegister
						style={{
							margin: "10px 30px",
							color: "darkblue",
						}}
						onClick={() => navigate("/mobile/corteB")}
					/>
					{/* <GiOpenBook
						style={{
							margin: "10px 30px",
							color: "darkblue",
						}}
						onClick={() => navigate("/mobile/encargos")}
					/> */}
					<MdLocalGroceryStore
						style={{
							margin: "10px 30px",
							color: "darkblue",
						}}
						onClick={() => navigate("/mobile/venta")}
					/>
				</Row>
			</div>
		</>
	);
}
