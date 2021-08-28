import React, { useState, useRef, useEffect } from "react";
import LogoLeo from "assets/png/logo.png";
import { useMutation } from "@apollo/client";
import { LOGIN } from "graphql/user";
import { FaUserAlt } from "react-icons/fa";
import { RiShieldUserFill, RiLockPasswordFill } from "react-icons/ri";
import { openNotification } from "Utils/openNotification";
import { setToken, decodeToken } from "Utils/token";
import useAuth from "hooks/useAuth";
import "./login.css";
import { UrlFrontend } from "config/apollo";
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

const Login = () => {
	const [mutateLOGIN] = useMutation(LOGIN);
	const [name, setname] = useState("");
	const [password, setpassword] = useState("");
	const [loading, setloading] = useState(false);
	const { setUser } = useAuth();
	const { Header, Footer } = Layout;
	const [form] = Form.useForm();
	const vendedor = useRef();
	const contraseña = useRef();
	useEffect(() => {
		// vendedor.current.select();
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
				setloading(false);
				window.location.href = `${UrlFrontend}caja`;
				const { token } = data.login;
				setToken(token);
				let dataToken = await decodeToken(token);
				setUser(dataToken);
				openNotification("success", `Bienvenido ${dataToken.name}`);
			}
		} catch (error) {
			openNotification("error", "Error en Usuario o Contraseña");
			setloading(false);
			console.log(error);
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
					<Card id='cardLogin'>
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
						{/* Ingresar Precio */}
						<div
							style={{
								textAlign: "center",
								padding: "7px",
								borderRadius: "25px 5px 0 0",
							}}
						>
							<Form form={form}>
								<Select
									ref={vendedor}
									disabled={loading}
									id='inputLogin'
									prefix={<FaUserAlt />}
									style={{
										color: "#000058",
										// fontSize: 30,
										fontSize: "x-large",
										fontWeight: "bold",
										borderRadius: "50px",
										width: "60%",
										padding: "5",
										border: "0 0 0 0",
										margin: "10px",
									}}
									onKeyUp={pressKeyEnter}
									onChange={(e) => setname(e)}
									value={name}
								>
									<Option value='MARCO'>MARCO</Option>
									<Option value='PAO'>PAO</Option>
									<Option value='ISABEL LEÓN'>ISABEL LEÓN</Option>
									<Option value='ISABEL SALAZAR'>ISABEL SALAZAR</Option>
									<Option value='LUPITA'>LUPITA</Option>
									<Option value='GABY'>GABY</Option>
									<Option value='JESSICA'>JESSICA</Option>
								</Select>
								<Input
									ref={contraseña}
									id='inputLogin2'
									prefix={<RiLockPasswordFill />}
									disabled={loading}
									type='password'
									style={{
										color: "#000058",
										// fontSize: 30,
										fontSize: "x-large",
										fontWeight: "bold",
										borderRadius: "50px",
										maxWidth: "60%",
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
