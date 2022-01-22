import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

export default function Error() {
	return (
		<div>
			<Result
				status='404'
				title='404'
				subTitle='Lo siento, esta pagina no existe.'
				extra={
					<Link
						to={{
							pathname: `/`,
						}}
					>
						<Button type='primary'>Regresar a principal</Button>
					</Link>
				}
				style={{ padding: "35px 30px 0" }}
			/>
			,
		</div>
	);
}
