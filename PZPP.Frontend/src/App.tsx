import axios from "axios";
import { useEffect, useRef } from "react";
import { createRoutesFromElements, Route } from "react-router";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { axiosAuth } from "./axiosClient";
import { useUserContext } from "./hooks/useUserContext";
import Layout from "./layout/Layout";
import Index from "./pages/Index/Index";
import Test from "./pages/Test/Test";


const App = () => {
	const alreadyRan = useRef(false);
	const { refreshUser } = useUserContext();

	useEffect(() => {
		if(alreadyRan.current) return;
		
		// Attach axios refresh token interceptor
		axiosAuth.interceptors.response.use(response => response, async (error) => {
			if(error.response.status != 401) {
				return Promise.reject(error);
			}
		
			try {
				const resRefresh = await axios.get('/api/auth/refresh');
				return axios(error.response.config);
			} catch(error) {
				return Promise.reject(error);
			}
		});
		console.log('Interceptor attach');
		// Refresh user context
		refreshUser();

		alreadyRan.current = true;
	}, []);

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route element={<Layout />}>
				<Route index element={<Index />} />
				<Route path='/test' element={<Test />} />
			</Route>
		)
	)

	return (
		<RouterProvider router={router} />
	)
}

export default App
