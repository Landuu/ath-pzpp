import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface CartProductDto {
    Id: number
    Quantity: number
    Stock: number
    Name: string
    PriceNetto: number
    PriceBrutto: number
    ImageUrl: string
}

export const useQueryCart = () => {
    return useQuery<CartProductDto[]>({
        queryFn: async () => {
            const cart = window.localStorage.getItem('cart') ?? '[]';
            const res = await axios.get('/api/orders/cart', {
                params: {
                    cart: btoa(cart)
                }
            })
            return res.data;
        },
        queryKey: ['cart']
    });
}