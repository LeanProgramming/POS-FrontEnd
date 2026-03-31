import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProductsPage } from '../pages/products/ProductsPage';

export const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/products' element={<ProductsPage />} />
			</Routes>
		</BrowserRouter>
	);
};
