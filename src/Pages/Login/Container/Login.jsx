import React, { useState, useRef, useEffect, useContext } from "react";
import { RiShieldUserFill, RiLockPasswordFill } from "react-icons/ri";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import { setToken, decodeToken } from "Utils/token";
import { LOGIN } from "myGraphql/user";
import { FaUserAlt } from "react-icons/fa";
import LogoLeo from "assets/png/logo.png";
import "./login.css";
import {
	Card,
	Form,
	Button,
	Input,
	Layout,
	Row,
	Switch,
	Avatar,
	Select,
} from "antd";
import AuthContext from "context/Auth/AuthContext";
import logoLeo from "../logo512.png";

const Login = () => {
	const [mutateLOGIN, { loading: loadImage }] = useMutation(LOGIN);
	const screenWidth = window.screen.width;

	const [name, setname] = useState("");
	const [password, setpassword] = useState("");
	const { setAuth, setFirstLogin } = useContext(AuthContext);
	const { Header, Footer } = Layout;

	const [form] = Form.useForm();
	const contraseña = useRef();

	useEffect(() => {
		document.querySelector("#inputLogin").select();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const { Option } = Select;
	const sendLogin = async () => {
		setFirstLogin(screenWidth);

		try {
			const { data } = await mutateLOGIN({
				variables: {
					input: {
						name: name,
						password: password,
					},
				},
			});
			if (data) {
				// Data Locale Storage
				const { token } = data.login;
				setToken(token);
				const dataToken = await decodeToken(token);
				setAuth(dataToken);
				openNotification("success", `Bienvenido ${dataToken.name}`);
			}
		} catch (error) {
			openNotification("error", "Error en Usuario o Contraseña");
		}
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			if (name && !password) {
				contraseña.current.select();
			} else if (name && password) {
				sendLogin();
			}
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<Layout>
				<Header
					style={{
						background: "linear-gradient(#0000A6,#000066,#000058)",
						margin: 0,
						height: "50px",
						color: "white",
						padding: 0,
					}}
				>
					<Row justify='space-between'>
						<Avatar src={LogoLeo} size='large' />
						<Switch
							checked={false}
							style={{
								background: "red",
								margin: "10px 10px",
							}}
						></Switch>
					</Row>
				</Header>
				<div
					style={{
						alignSelf: "center",
						padding: "50px",
						borderRadius: "25px 5px 0 0",
						height: "75vh",
					}}
				>
					<Card id={screenWidth > 600 ? "cardLogin" : "cardLoginMobile"}>
						<div
							style={{
								background: "#000058",
								textAlignLast: "center",
								padding: "15px",
								borderRadius: "25px 5px 0 0",
							}}
						>
							<Row justify='center'>
								<RiShieldUserFill
									style={{ color: "white", fontSize: "xx-large" }}
								/>
								<h1 style={{ color: "white" }}>Ingresa a tu cuenta</h1>
							</Row>
						</div>
						<div
							style={{
								textAlign: "center",
								padding: "7px",
								borderRadius: "25px 5px 0 0",
							}}
						>
							<Form form={form}>
								<Select
									disabled={loadImage}
									id='inputLogin'
									placeholder='Busca Apartados'
									optionFilterProp='children'
									prefix={<FaUserAlt />}
									onKeyUp={pressKeyEnter}
									onChange={(e) => setname(e)}
									value={name}
									showSearch
									filterOption={(input, option) =>
										option.children
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
									style={{
										width: "80%",
										padding: "5",
										border: "0 0 0 0",
										margin: "10px",
									}}
								>
									<Option value='PAO' key='PAO'>
										PAO
									</Option>
									<Option value='ISABEL LEÓN' key='ISABEL LEÓN'>
										ISABEL LEÓN
									</Option>
									<Option value='ISABEL SALAZAR' key='ISABEL SALAZAR'>
										ISABEL SALAZAR
									</Option>
									<Option value='LUPITA' key='LUPITA'>
										LUPITA
									</Option>
									<Option value='GABY' key='GABY'>
										GABY
									</Option>
									<Option value='JESSICA' key='JESSICA'>
										JESSICA
									</Option>
									<Option value='ROCIO' key='ROCIO'>
										ROCIO
									</Option>
									<Option value='MARCO' key='MARCO'>
										MARCO
									</Option>
								</Select>
								<Input
									ref={contraseña}
									id='inputLogin2'
									prefix={<RiLockPasswordFill />}
									disabled={loadImage}
									type='password'
									placeholder='Contraseña'
									style={{
										color: "#000058",
										fontSize: "x-large",
										fontWeight: "bold",
										borderRadius: "50px",
										maxWidth: "80%",
										padding: "5",
										border: "0 0 0 0",
										margin: "10px",
									}}
									name='password'
									onKeyUp={pressKeyEnter}
									onChange={(e) => setpassword(e.target.value)}
								/>
							</Form>
							<br />
							<Button
								loading={loadImage}
								type='primary'
								shape='round'
								style={{
									width: "60%",
									height: "40px",
									margin: "20px",
									fontSize: "large",
								}}
								onClick={() => sendLogin()}
							>
								Iniciar sesión
							</Button>
						</div>
					</Card>
				</div>

				<Footer style={{ textAlign: "center" }}>
					Creado por MarcoASR ©2022
				</Footer>
			</Layout>
			{loadImage && (
				<div className='pageLoading'>
					<img src={logoLeo} alt='img' className='imagenLogin' />
				</div>
			)}
		</div>
	);
};

export default Login;
