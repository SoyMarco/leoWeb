import { useState } from "react";
import { GiDelicatePerfume } from "react-icons/gi";
import { Modal, Input, Button, Row, Checkbox, Space } from "antd";
import { SaveFilled } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { REGISTER_PERFUME, GET_ALL_PERFUME } from "myGraphql/perfume";
import aceptar from "assets/sonido/Aceptar.wav";
import BDivider from "Components/BDivider/Bdivider";

function ModalAddPerfume({ modalAddVisible, setmodalAddVisible }) {
	const [mutateREGISTER_PERFUME, { loading }] = useMutation(REGISTER_PERFUME);

	let { refetch } = useQuery(GET_ALL_PERFUME, {
		notifyOnNetworkStatusChange: true,
	});

	const audio = new Audio(aceptar);
	const [nombreValue, setnombreValue] = useState(undefined);
	const [typeValues, settypeValues] = useState([]);
	const [generoValues, setgeneroValues] = useState([]);
	const incialState = () => {
		setgeneroValues([]);
		settypeValues([]);
		setnombreValue(undefined);
	};
	const savePerfume = async () => {
		if (loading) return;
		try {
			let input = {
				nombre: nombreValue,
				genero: generoValues,
				tipo: typeValues,
			};
			console.log(input);
			const { data } = await mutateREGISTER_PERFUME({
				variables: { input },
			});
			if (data) {
				refetch();
				audio.play();
				incialState();
				setmodalAddVisible(false);
			}
		} catch (error) {}
	};
	const colorBtn = () => {
		if (typeValues.length && generoValues.length && nombreValue) {
			return "linear-gradient(#32A632,#005800)";
		}
		return "grey";
	};
	const disabledBtn = () => {
		if (typeValues.length && generoValues.length && nombreValue) {
			return false;
		}
		return true;
	};
	const selectAll = () => {
		setgeneroValues(["Dama", "Caballero"]);
		settypeValues(["Chico", "Grande", "Desodorante"]);
	};
	return (
		<Modal
			key='keyModal'
			style={{ top: 25 }}
			className='ModalCobrarPrincipal'
			title={
				<>
					<GiDelicatePerfume style={{ marginRight: "10px" }} />
					Agregar Perfume
				</>
			}
			visible={modalAddVisible}
			onCancel={() => setmodalAddVisible(!modalAddVisible)}
			footer={[
				<Row justify='end' key='keyRowBtns'>
					<Button
						style={{
							background: colorBtn(),
							color: "white",
							fontWeight: "bold",
							width: 230,
						}}
						disabled={disabledBtn()}
						shape='round'
						size='large'
						onClick={() => savePerfume()}
						icon={<SaveFilled />}
						loading={loading}
						key='keybtnf2'
					>
						Guardar
					</Button>
				</Row>,
			]}
		>
			<Input
				placeholder='Nombre de perfume'
				autoFocus={true}
				prefix={<GiDelicatePerfume />}
				onChange={(e) => setnombreValue(e.target.value)}
				className='InputModalCobrar'
				value={nombreValue}
			></Input>
			<Button type='primary' shape='round' onClick={() => selectAll()}>
				Seleccionar todo
			</Button>
			<BDivider title={"Generos:"} />
			<Checkbox.Group
				style={{ width: "100%" }}
				value={generoValues}
				onChange={(e) => setgeneroValues(e)}
			>
				<Space
					direction='vertical'
					id='spaceManageImage'
					key='spaceVerticalDrawer'
				>
					<Checkbox value='Dama'>
						<span
							style={{
								color: generoValues.length ? "black" : "red",
								fontSize: "large",
							}}
						>
							Dama
						</span>
					</Checkbox>
					<Checkbox value='Caballero'>
						<span
							style={{
								color: generoValues.length ? "black" : "red",
								fontSize: "large",
							}}
						>
							Caballero
						</span>
					</Checkbox>
				</Space>
			</Checkbox.Group>
			<BDivider title={"Tamaños:"} />

			<Checkbox.Group
				style={{ width: "100%" }}
				value={typeValues}
				onChange={(e) => settypeValues(e)}
			>
				<Space
					direction='vertical'
					id='spaceManageImage'
					key='spaceVerticalDrawer'
				>
					<Checkbox value='Chico'>
						<span
							style={{
								color: typeValues.length ? "black" : "red",
								fontSize: "large",
							}}
						>
							Chico
						</span>
					</Checkbox>
					<Checkbox value='Grande'>
						<span
							style={{
								color: typeValues.length ? "black" : "red",
								fontSize: "large",
							}}
						>
							Grande
						</span>
					</Checkbox>
					<Checkbox value='Desodorante'>
						<span
							style={{
								color: typeValues.length ? "black" : "red",
								fontSize: "large",
							}}
						>
							Desodorante
						</span>
					</Checkbox>
				</Space>
			</Checkbox.Group>
		</Modal>
	);
}

export default ModalAddPerfume;
