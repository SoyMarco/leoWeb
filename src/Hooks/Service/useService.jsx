import { useContext } from "react";
import AuthContext from "context/Auth/AuthContext";
import ErrorConection from "Utils/ErrorConection";
import aceptar from "assets/sonido/Aceptar.wav";
import { openNotification } from "Utils/openNotification";

export default function useService() {
	const { setIsLoading, timeLogout } = useContext(AuthContext);
	const audioSuccess = new Audio(aceptar);

	const register = async ({ input, mutate, keyF }) => {
		setIsLoading(true);
		try {
			const { data } = await mutate({
				variables: { input },
			});
			if (data) {
				audioSuccess.play();
				if (keyF === "F2") openNotification("success", "Guardado con exito");
				return data;
			}
		} catch (error) {
			ErrorConection(timeLogout);
			console.log(error);
		} finally {
			setIsLoading(false);
		}
		return undefined;
	};

	return { register };
}
