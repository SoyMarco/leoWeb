import React, { useEffect, useState, useContext } from "react";
import { Table, Result, Row, Tooltip, Button, Modal, Switch, Col } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import moment from "moment";
import { AiFillPrinter } from "react-icons/ai";
import SchemaProductos from "../Schema/SchemaProductos";
import { CANCELAR_VENTA } from "myGraphql/venta";
import { useMutation } from "@apollo/client";
import ErrorConection from "Utils/ErrorConection";
import { openNotification } from "Utils/openNotification";
import AuthContext from "context/Auth/AuthContext";

export default function Productos({
	stateRecord,
	modalProductos,
	setmodalProductos,
	setimprimir,
}) {
	const { timeLogout } = useContext(AuthContext);
	const [mutateCANCELAR_VENTA, { loading }] = useMutation(CANCELAR_VENTA);

	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [cantidadProductos, setcantidadProductos] = useState(0);
	const [sumaProductos, setsumaProductos] = useState(0);
	const [generalColor, setgeneralColor] = useState("green");
	useEffect(() => {
		if (stateRecord?.productos?.length > 0) {
			let numProd = 0;
			let sumProd = 0;
			for (const item of stateRecord?.productos) {
				if (item.cancelado !== true) {
					numProd = numProd + item.cantidad;
					sumProd = sumProd + item.totalArticulo;
				}
			}
			setcantidadProductos(numProd);
			setsumaProductos(sumProd);

			// Color general
			if (stateRecord?.cancelado === true) {
				setgeneralColor("red");
				return;
			}
			for (const item of stateRecord?.productos) {
				if (item.apartado > 0) {
					setgeneralColor("darkblue");
					return;
				}
			}
			setgeneralColor("green");
		}
	}, [stateRecord]);

	const onSelectChange = () => {
		setselectedRowKeys([]);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
	};

	const tooltipStatusAbono = (record) => {
		if (record.cancelado === true) {
			return "Desactivado";
		}
		return "Activado";
	};

	const pasarAFechaLLLL = (item) => {
		return moment.unix(item / 1000).format("LLLL");
	};

	const btnCancel = () => {
		setmodalProductos(false);
	};

	const cancelVenta = async () => {
		if (loading === false) {
			try {
				const { data } = await mutateCANCELAR_VENTA({
					variables: {
						input: {
							id: stateRecord.id,
							status: stateRecord.cancelado,
						},
					},
				});
				if (data) {
					openNotification(
						"success",
						`Venta ${
							stateRecord.cancelado ? "recuperada" : "cancelada"
						} con exito`
					);
				}
			} catch (error) {
				ErrorConection(timeLogout);
			}
		}
	};
	return (
		<Modal
			visible={modalProductos}
			width={"700px"}
			onCancel={() => btnCancel()}
			style={{ top: 50 }}
			className='ModalCobrarPrincipal'
			title={
				<>
					Productos de la venta: <b>{stateRecord?.folio}</b>
				</>
			}
			footer={[
				<Button
					key='submit'
					type='primary'
					size='large'
					onClick={() => btnCancel()}
				>
					Cerrar
				</Button>,
			]}
		>
			<Row justify='space-around'>
				<Col md={20}>
					<h2 style={{ color: generalColor }}>
						{pasarAFechaLLLL(stateRecord?.createAt)}
					</h2>
				</Col>
				<Col md={4}>
					<Tooltip placement='left' title={"Reimprimir"}>
						<Button
							icon={<AiFillPrinter style={{ fontSize: "30px" }} />}
							size='large'
							type='primary'
							ghost
							style={{
								color: generalColor,
							}}
							onClick={() => setimprimir(true)}
						/>
					</Tooltip>
					<Tooltip
						placement='top'
						title={() => tooltipStatusAbono(stateRecord)}
					>
						<Switch
							loading={loading}
							checked={!stateRecord?.cancelado}
							style={{
								background: generalColor,
								margin: "0 0 15px 15px",
							}}
							onClick={() => cancelVenta()}
						/>
					</Tooltip>
				</Col>
			</Row>
			{/* PRODUCTOS */}
			<Table
				rowKey={(record) => record._id}
				columns={SchemaProductos(stateRecord)}
				dataSource={stateRecord?.productos}
				pagination={false}
				bordered
				rowSelection={rowSelection}
				size='small'
				scroll={{ y: 350 }}
				style={{
					borderRadius: "15px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					marginTop: "10px",
				}}
				onRow={(record, rowIndex) => {
					return {
						onClick: (e) => {
							click(record, rowIndex);
						},
					};
				}}
				locale={{
					emptyText: (
						<Result
							icon={<SmileOutlined />}
							// status="500"
							subTitle='Selecciona una venta'
						/>
					),
				}}
			/>
			<Row align='space-around'>
				<h1 className='numeroProductos'>
					{cantidadProductos ? `Productos: ${cantidadProductos}` : null}
				</h1>
				<h1 className='totalProductos'>
					{sumaProductos ? `$ ${sumaProductos}` : null}
				</h1>
			</Row>
		</Modal>
	);
}
