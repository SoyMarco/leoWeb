import React from "react";
import XLSX from "xlsx";
export default function Migration() {
	const excelToJson = () => {
		const excel = XLSX.readFile(
			"C:\\Users\\Marco\\Desktop\\ToJson\\Libro1.xlsx"
		);
		var nombreHoja = excel.SheetNames;
		let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]], {
			cellDates: true,
		});
		const jDatos = {};
		// for (let i = 0; i < datos.length; i++){
		//     const dato = dato[i]
		//     jDatos.push(...dato, fecha: new)
		// }
		console.log(datos);
	};
	return (
		<div>
			<button onClick={() => excelToJson()}>Hola amigo</button>
		</div>
	);
}
