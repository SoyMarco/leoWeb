import React, { useEffect, useState } from "react";
import { SmileOutlined, PrinterFilled } from "@ant-design/icons";
import { VENTA_MOBILE_FALSE } from "../../../graphql/venta";
import { useQuery, useMutation } from "@apollo/client";
import Imprimir from "../Components/Imprimir/Imprimir";
import { GET_VENTAS_MOBILE } from "graphql/venta";
import ErrorConection from "Utils/ErrorConection";
import { Button, notification } from "antd";
import useAuth from "hooks/useAuth";

export default function GetVentasF3({
	refetchVentaMobile,
	setrefetchVentaMobile,
}) {
	const { auth } = useAuth();

	let {
		data,
		error: errorGetVentas,
		loading: loadingVM,
		refetch: refetchVM,
		startPolling,
		stopPolling,
	} = useQuery(GET_VENTAS_MOBILE);
	const [mutateVENTA_MOBILE_FALSE] = useMutation(VENTA_MOBILE_FALSE);
	console.log("loadingVM", loadingVM);

	if (errorGetVentas) {
		ErrorConection();
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
							type='danger'
							loading={loader}
							onClick={() => ventaMobileToFalse(key)}
							style={{
								margin: "-10px 20px 1px",
								// fontSize: "large",
								// background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
							}}
						>
							No
						</Button>
						<Button
							type='primary'
							loading={loader}
							onClick={() => printMobile(element)}
							icon={<PrinterFilled style={{ marginTop: 5 }} />}
							style={{
								margin: "-10px 0",
								// fontSize: "large",
								// background: "linear-gradient(#32A632,#005800)",
							}}
						>
							Si
						</Button>
					</>
				);
				notification.open({
					key,
					message: `${element.vendedor} $${element.total}`,
					description: "¿Imprir la venta Mobile?",
					icon: <SmileOutlined style={{ color: "#108ee9" }} />,
					btn,
					duration: 0,
					style: {
						width: 250,
						padding: "5px 15px",
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
			ErrorConection();
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
