import React, { useEffect, useState, useContext } from "react";
import { VENTA_MOBILE_FALSE, GET_VENTAS_MOBILE } from "myGraphql/venta";
import { useQuery, useMutation } from "@apollo/client";
import Imprimir from "../Imprimir/Imprimir";
import ErrorConection from "Utils/ErrorConection";
import { PrinterFilled } from "@ant-design/icons";
import { FaUserAstronaut } from "react-icons/fa";
import { Button, notification } from "antd";
import AuthContext from "context/Auth/AuthContext";

export default function GetVentasF3({
	refetchVentaMobile,
	setrefetchVentaMobile,
}) {
	const { auth, timeLogout } = useContext(AuthContext);

	let {
		data,
		error: errorGetVentas,
		refetch: refetchVM,
		startPolling,
		stopPolling,
	} = useQuery(GET_VENTAS_MOBILE);
	const [mutateVENTA_MOBILE_FALSE] = useMutation(VENTA_MOBILE_FALSE);

	if (errorGetVentas) {
		ErrorConection(timeLogout);
	}
	useEffect(() => {
		startPolling(300000);
		return () => {
			stopPolling();
		};
	}, [startPolling, stopPolling]);

	const [loader, setloader] = useState(false);
	const [imprimir, setimprimir] = useState(false);
	const [stateRecord, setstateRecord] = useState([]);
	useEffect(() => {
		if (refetchVentaMobile === true) {
			refetchVM();
			setTimeout(() => {
				setrefetchVentaMobile(false);
			}, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetchVentaMobile]);
	useEffect(() => {
		if (data?.getVentasMobile) {
			let { getVentasMobile } = data;

			for (const iterator of getVentasMobile) {
				const element = iterator;
				const key = element.id;
				const btn = (
					<>
						<Button
							shape='round'
							loading={loader}
							onClick={() => printMobile(element)}
							icon={<PrinterFilled />}
							style={{
								margin: "0 10px 0 0",
								width: "130px",
								background: "linear-gradient(#2196F3,#0000E6)",
								color: "white",
								fontWeight: "bold",
							}}
						>
							Imprimir
						</Button>
						<Button
							shape='round'
							loading={loader}
							onClick={() => ventaMobileToFalse(key)}
							style={{
								background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
								color: "white",
								fontWeight: "bold",
							}}
						>
							No
						</Button>
					</>
				);
				notification.open({
					key,
					message: (
						<b>
							{element.vendedor}: ${element.total}
						</b>
					),
					description: "¿Imprir la venta Mobile?",
					icon: (
						<FaUserAstronaut
							style={{
								color: "darkBlue",
								fontSize: "x-large",
								margin: "10px 0 0 0",
							}}
						/>
					),
					btn,
					duration: 0,
					style: {
						width: 250,
						padding: "5px 15px",
						boxShadow: "5px 5px 29px #b3b3b3, -5px -5px 29px #c2c2c2",
					},
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const ventaMobileToFalse = async (key) => {
		setloader(true);
		try {
			const { data: dataMobile } = await mutateVENTA_MOBILE_FALSE({
				variables: {
					input: {
						id: key,
					},
				},
			});
			if (dataMobile) {
				notification.close(key);
				setloader(false);
			}
		} catch (error) {
			setloader(false);
			ErrorConection(timeLogout);
		}
	};
	const printMobile = (element) => {
		setstateRecord(element);
		setimprimir(true);
	};
	return (
		<>
			{imprimir ? (
				<Imprimir
					imprimir={imprimir}
					setimprimir={setimprimir}
					stateRecord={stateRecord}
					auth={auth}
					ventaMobileToFalse={ventaMobileToFalse}
				/>
			) : null}
		</>
	);
}
