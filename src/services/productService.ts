import { api } from "../api/api"

export const getProducts = async () => {

    try {
        const {data} = await api.get('/products')

            return data
    } catch (error) {
        console.log({error})
    }
    
}

export const createProduct = async (productData: any) => {

    try {
        const {data} = await api.post('/products', productData)

            return data
    } catch (error) {
        console.log({error})
    }
    
}
