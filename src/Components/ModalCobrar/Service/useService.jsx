import { useContext, useState } from "react";
import AuthContext from "context/Auth/AuthContext";
import ErrorConection from "Utils/ErrorConection";
import aceptar from "assets/sonido/Aceptar.wav";
import { openNotification } from "Utils/openNotification";

export default function useService() {
	const { setIsLoading, timeLogout } = useContext(AuthContext);
	const [dataReturn, setdataReturn] = useState(undefined);
	const [keyFunc, setkeyFunc] = useState(undefined);

	const audioSuccess = new Audio(aceptar);

	const register = async ({ input, mutate, keyF }) => {
		setIsLoading(true);
		setkeyFunc(keyF);
		try {
			const { data } = await mutate({
				variables: { input },
			});
			if (data) {
				setdataReturn(data);
				audioSuccess.play();
			}
			if (data && keyF === "F2") {
				openNotification("success", "Guardado con exito");
			}
		} catch (error) {
			ErrorConection(timeLogout);
		} finally {
			setIsLoading(false);
		}
	};

	return { dataReturn, register, keyFunc };
}
