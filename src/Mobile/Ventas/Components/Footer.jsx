import React from "react";
import { Row } from "antd";
export default function Horizontal({
	totalProductos,
	totalTotal,
	setinputVisible,
}) {
	return (
		<>
			{/* HORIZONTAL */}
			<div
				style={{
					background: "white",
					margin: 0,
					height: "55px",
					// color: "white",
					// padding: 0,
					fontSize: "x-large",
				}}
				onClick={() => setinputVisible(false)}
			>
				<Row justify='space-around'>
					<h3 style={{ margin: "10px 0 0 -50px" }}>
						{totalProductos ? `Productos: ${totalProductos}` : null}
					</h3>
					<h2 style={{ color: "green", fontWeight: "bold" }}>
						{totalProductos ? `$ ${totalTotal}` : null}
					</h2>
				</Row>
			</div>
		</>
	);
}
