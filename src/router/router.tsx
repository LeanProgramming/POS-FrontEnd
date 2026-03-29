import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ProductsPage } from "../pages/Products/ProductsPage"

export const Router = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/products" element={<ProductsPage/>}/>  
        </Routes>
    </BrowserRouter>
}