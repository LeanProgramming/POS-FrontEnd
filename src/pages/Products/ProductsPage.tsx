import { useEffect, useState } from "react"
import type { IProduct } from "../../types/product"
import { getProducts } from "../../services/productService"

export const ProductsPage = () => {

    const [products, setProducts] = useState<IProduct[]>([])

    useEffect(()=>{
        loadProducts()
    },[])

    const loadProducts = async () => {
        const data = await getProducts()
        setProducts(data)
    }
  return (
   <div>

      <h1>Productos</h1>

      {products.map((p) => (

        <div key={p.id}>

          {p.name} - ${p.price}

        </div>

      ))}

    </div>
  )
}
