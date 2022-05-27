import routes from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function NavToken() {
	const hasContext = (route) => {
		if (route.context) {
			return (
				<route.context>
					<route.component />
				</route.context>
			);
		}
		return <route.component />;
	};

	return (
		<BrowserRouter>
			<Routes>
				{routes?.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						exact={route.exact}
						element={<route.layout>{hasContext(route)}</route.layout>}
					/>
				))}
			</Routes>
		</BrowserRouter>
	);
}
