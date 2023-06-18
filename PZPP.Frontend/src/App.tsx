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
import Account from "./pages/Account/Account";
import Products from "./pages/Products/Products";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import CartSummary from "./pages/CartSummary/CartSummary";


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
				const res = await axios.get('/api/auth/refresh');
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
				<Route path='/products' element={<Products />} />
				<Route path='/products/:id' element={<Product />} />
				<Route path='/cart' element={<Cart />} />
				<Route path='/cart/summary' element={<CartSummary />} />

				<Route element={<RouteGuard />}>
					<Route path='/account' element={<Account />} />
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
