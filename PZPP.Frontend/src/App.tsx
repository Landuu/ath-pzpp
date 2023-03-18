import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { createRoutesFromElements, Route } from "react-router";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { axiosAuth } from "./axiosClient";
import RouteGuard from "./components/RouteGuard";
import { useUserContext } from "./hooks/useUserContext";
import Layout from "./layout/Layout";
import Admin from "./pages/Admin/Admin";
import Index from "./pages/Index/Index";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";


const App = () => {
	const alreadyRan = useRef(false);
	const { refreshUser } = useUserContext();
	const [render, setRender] = useState(false);

	useEffect(() => {
		if (alreadyRan.current) return;

		// Attach axios refresh token interceptor
		axiosAuth.interceptors.response.use(response => response, async (error) => {
			if (error.response.status != 401) {
				return Promise.reject(error);
			}

			try {
				const resRefresh = await axios.get('/api/auth/refresh');
				return axios(error.response.config);
			} catch (error) {
				return Promise.reject(error);
			}
		});

		// Fetch user and render app
		const setup = async () => {
			await refreshUser();
			setRender(true);
		}
		setup();

		alreadyRan.current = true;
	}, []);

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route element={<Layout />}>
				<Route index element={<Index />} />

				<Route element={<RouteGuard />}>
					<Route path='/profile' element={<Profile />} />
					<Route path='/orders' element={<Orders />} />
				</Route>

				<Route element={<RouteGuard onlyAdmin={true} />}>
					<Route path='/admin' element={<Admin />} />
				</Route>
			</Route>
		)
	)

	return (<>
		{render && <RouterProvider router={router} />}
	</>)
}

export default App
