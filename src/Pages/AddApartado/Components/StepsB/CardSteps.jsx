import { useContext } from "react";
import { Steps, Button, message, Card, Row } from "antd";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";
import StepsB from "./StepsB";

const CardSteps = () => {
	const { current, next, prev } = useContext(NewAparadoContext);

	const { Step } = Steps;
	const steps = StepsB();

	return (
		<Card
			style={{
				borderRadius: "38px",
				boxShadow: "17px 17px 35px #7a7a7a,-7px -7px 30px #ffffff",
				minHeight: 300,
				top: "5%",
			}}
		>
			<div style={{ margin: "10px 30px" }}>
				<Steps current={current}>
					{steps.map((item) => (
						<Step key={item.title} title={item.title} />
					))}
				</Steps>
				<div className='steps-content'>{steps[current].content}</div>
				<Row justify='end'>
					<div className='steps-action'>
						{current > 0 && (
							<Button
								shape='round'
								style={{
									margin: "0 8px",
									color: "white",
									background: "linear-gradient(#2196F3,#0000E6)",
								}}
								onClick={() => prev()}
							>
								Regresar
							</Button>
						)}
						{current < steps.length - 1 && (
							<Button
								shape='round'
								onClick={() => next()}
								style={{
									background: "linear-gradient(#32A632,#005800)",
									color: "white",
								}}
							>
								Siguiente
							</Button>
						)}
						{current === steps.length - 1 && (
							<>
								<Button
									shape='round'
									onClick={() => message.success("Processing complete!")}
									style={{
										background: "linear-gradient(#32A632,#005800)",
										color: "white",
									}}
								>
									Cobrar (Enter)
								</Button>
							</>
						)}
					</div>
				</Row>
			</div>
		</Card>
	);
};

export default CardSteps;
