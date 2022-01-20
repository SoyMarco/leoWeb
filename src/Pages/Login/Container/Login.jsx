import React, { useState, useRef, useEffect, useContext } from "react";
import { RiShieldUserFill, RiLockPasswordFill } from "react-icons/ri";
import { useMutation, useApolloClient } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import { setToken, decodeToken } from "Utils/token";
import { LOGIN, FIRST_LOGIN } from "graphql/user";
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
	Menu,
	Avatar,
	Select,
} from "antd";
import AuthContext from "context/Auth/AuthContext";

const Login = () => {
	const client = useApolloClient();
	const [mutateLOGIN] = useMutation(LOGIN);
	const [name, setname] = useState("");
	const [password, setpassword] = useState("");
	const [loading, setloading] = useState(false);
	const { setAuth } = useContext(AuthContext);
	const { Header, Footer } = Layout;
	const [screenWidth, setscreenWidth] = useState(1000);
	const [form] = Form.useForm();
	const contraseña = useRef();
	useEffect(() => {
		let detectorPantalla = window.screen.width;
		setscreenWidth(detectorPantalla);
		document.querySelector("#inputLogin").select();
	}, []);
	const { Option } = Select;
	const sendLogin = async () => {
		setloading(true);
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
				// Data GQL
				setloading(false);
				client.writeQuery({
					query: FIRST_LOGIN,
					data: { firstLogin: { screenWidth } },
				});
				// Data Locale Storage
				const { token } = data.login;
				setToken(token);
				let dataToken = await decodeToken(token);
				setAuth(dataToken);
				openNotification("success", `Bienvenido ${dataToken.name}`);
			}
		} catch (error) {
			openNotification("error", "Error en Usuario o Contraseña");
			setloading(false);
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
		<>
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
					<Menu
						mode='horizontal'
						defaultSelectedKeys={["2"]}
						style={{
							background: "transparent",
							margin: "-10px 0 0 0",
							// height: "50px",
							color: "white",
							width: "100%",
						}}
					>
						<Menu.Item
							key='1'
							style={{
								background: "transparent",
								margin: 0,
								color: "white",
							}}
							icon={<Avatar src={LogoLeo} size='large' />}
						>
							Bazar Leo
						</Menu.Item>
						<Menu.Item key='2'></Menu.Item>
						<Menu.Item key='3'></Menu.Item>
						<Menu.Item
							key='4'
							style={{
								display: "flex",
								flexDirection: "column",
								float: "right",
								marginLeft: "auto",
							}}
						>
							<Switch
								style={{
									background: "red",
									// boxShadow: "5px 5px 19px #b3b3b3, -5px -5px 19px #ffffff",
								}}
								// onChange={logoutApp}
							></Switch>
						</Menu.Item>
					</Menu>
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
									disabled={loading}
									id='inputLogin'
									placeholder='Busca Apartados'
									optionFilterProp='children'
									prefix={<FaUserAlt />}
									onKeyUp={pressKeyEnter}
									onChange={(e) => setname(e)}
									value={name}
									showSearch
									filterOption={(input, option) =>
										option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
									style={{
										color: "#000058",
										// fontSize: 30,
										fontSize: "large",
										fontWeight: "bold",
										borderRadius: "50px",
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
									disabled={loading}
									type='password'
									placeholder='Contraseña'
									style={{
										color: "#000058",
										// fontSize: 30,
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
								loading={loading}
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
					Creado por MarcoASR ©2021
				</Footer>
			</Layout>
		</>
	);
};

export default Login;
