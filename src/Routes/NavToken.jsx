import routes from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const NavToken = () => {
	return (
		<BrowserRouter>
			<Routes>
				{routes?.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						exact={route.exact}
						element={
							<route.layout>
								<route.component />
							</route.layout>
						}
					/>
				))}
			</Routes>
		</BrowserRouter>
	);
};
export default NavToken;
