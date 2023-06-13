import { useAtom } from "jotai";
import { atomCart } from "../atoms";
import { CartProduct } from "../types";
import { useQueryClient } from "@tanstack/react-query";

export const useCart = () => {
    const [cart, setCart] = useAtom(atomCart);
    const queryClient = useQueryClient();
    
    const invalidateQuery = () => {
        queryClient.invalidateQueries(['cart']);
    }

    const clearCart = () => {
        setCart([]);
        invalidateQuery();
    }

    const getCartProduct = (id: number) => {
        return cart.find(x => x.id == id);
    }

    const deleteCartProduct = (id: number) => {
        const newCart = cart.filter(c => c.id != id);
        setCart(newCart);
        invalidateQuery();
    }

    const addCartProduct = (id: number, quantity: number) => {
        const newProduct: CartProduct = {
            id,
            q: quantity
        }
        setCart([...cart, newProduct]);
        invalidateQuery();
    }

    const setCartProductQuantity = (id: number, quantity: number) => {
        const newCart = cart.map(p => {
            if(p.id != id) return p;

            return {
                ...p,
                q: quantity
            }
        });
        setCart(newCart);
        invalidateQuery();
    }

    return {cart, setCart, clearCart, addCartProduct, getCartProduct, deleteCartProduct, setCartProductQuantity}
}