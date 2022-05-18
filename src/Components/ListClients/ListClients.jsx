import { useEffect } from "react";
import { GET_CLIENTS_NAMES } from "myGraphql/apartado";
import { useQuery } from "@apollo/client";
import { AutoComplete } from "antd";

export default function ListClients({ cliente, setcliente, action }) {
	const { data: getClientsNames } = useQuery(GET_CLIENTS_NAMES);

	useEffect(() => {
		document.querySelector("#inputNameClient").select();
	}, []);

	return (
		<AutoComplete
			defaultActiveFirstOption={false}
			id='inputNameClient'
			autoFocus={true}
			backfill={true}
			size='large'
			onKeyUp={action}
			style={{
				color: "blue",
				fontSize: "x-large",
				fontWeight: "bold",
				borderRadius: "50px",
				width: "80%",
				margin: "5px",
			}}
			onChange={(e) => setcliente(e.toUpperCase())}
			value={cliente}
			options={getClientsNames?.getClientsNames}
			placeholder='Ingresa el nombre de cliente'
			filterOption={(inputValue, option) =>
				option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
			}
		/>
	);
}
