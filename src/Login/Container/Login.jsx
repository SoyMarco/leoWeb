import React, { useEffect, useState } from "react";
import { Card, Form, Button, Input, Layout, Row } from "antd";
import { /* useQuery, gql, */ useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/user";
import { FaUserAlt } from "react-icons/fa";
import { RiShieldUserFill, RiLockPasswordFill } from "react-icons/ri";
import { openNotification } from "../../Utils/openNotification";
import { setToken, decodeToken } from "../../Utils/token";
import useAuth from "../../hooks/useAuth";
import Logo from "../../assets/png/logo.png";
import "./login.css";
const Login = () => {
	const [mutateLOGIN] = useMutation(LOGIN);
	const [name, setname] = useState("");
	const [password, setpassword] = useState("");
	const { setUser } = useAuth();
	const { Header, Content, Footer } = Layout;
	const [form] = Form.useForm();

	const sendLogin = async () => {
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
				const { token } = data.login;
				setToken(token);
				let dataToken = await decodeToken(token);
				setUser(dataToken);
				openNotification("success", `Bienvenido ${dataToken.name}`);
				console.log(dataToken);
			}
		} catch (error) {
			openNotification("error", "Error en Usuario o Contraseña");
		}
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			sendLogin();
		}
	};
	return (
		<>
			<Layout>
				<Header
					style={{ background: "linear-gradient(#0000A6,#000066,#000058)" }}
				>
					<Row>
						<img src={Logo} style={{ maxHeight: 40, margin: 10 }} />
						<h1 id="nameLogo">Bazar Leo</h1>
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
					<Card id="cardLogin">
						<div
							style={{
								background: "#000058",
								textAlignLast: "center",
								padding: "15px",
								borderRadius: "25px 5px 0 0",
							}}
						>
							<Row justify="center">
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
								<Input
									id="inputLogin"
									prefix={<FaUserAlt />}
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
									onKeyUp={pressKeyEnter}
									onChange={(e) => setname(e.target.value)}
								/>
								<Input
									id="inputLogin"
									prefix={<RiLockPasswordFill />}
									type="password"
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
									name="password"
									onKeyUp={pressKeyEnter}
									onChange={(e) => setpassword(e.target.value)}
								/>
							</Form>
							<br />
							<Button
								type="primary"
								shape="round"
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
