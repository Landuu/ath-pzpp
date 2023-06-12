import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "devextreme-react/button";
import { NumberBox } from 'devextreme-react/number-box';
import { useAtom } from "jotai";
import { useState } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { atomCart } from "../../atoms";
import Container from "../../components/Container";
import { useToast } from "../../hooks/useToast";
import { CartProduct } from "../../types";
import { ProductDto } from "../Products/Products";

const Product = () => {
    const {id} = useParams();
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useAtom(atomCart);
    const showToast = useToast();

    const {data} = useQuery<ProductDto>({
        queryFn: async () => await (await axios.get('/api/products/' + id)).data,
        queryKey: ['products', id]
    })

    const handleAddToCart = () => {
        if(!data) return;
        const itemIndex = cart.findIndex(x => x.ProductId == data.Id);
        if(itemIndex != -1) {
            if(cart[itemIndex].Quantity + quantity > data.Stock)
                cart[itemIndex].Quantity = data.Stock;
            else
                cart[itemIndex].Quantity += quantity;
            setCart(cart);
        } else {
            const newItem: CartProduct = {
                ProductId: data.Id,
                Quantity: quantity
            };
            setCart([...cart, newItem]);
        }
        setQuantity(1);
        showToast(`Dodano ${quantity} szt. do koszyka!`, "success");
        console.log(cart);
    }

    return (
        <Container className="my-10">
            <div className="mb-3">
                <Link to='/products'>
                    <Button text='Powrót do produktów' icon="back" stylingMode="text" />
                </Link>
            </div>

            <div className="grid grid-cols-2">
                <div className="flex justify-center">
                    <img src={data?.ImageUrl} className="w-96" />
                </div>
                <div>
                    <div className="text-xl font-medium">
                        {data?.Name}
                    </div>
                    <div className="space-x-2 text-gray-500">
                        <span>Numer produktu:</span>
                        <span className="font-bold">
                            {data?.Id}
                        </span>
                    </div>
                    <div className="py-3 text-gray-800">
                        {data?.Description}
                    </div>
                    <div className="grid grid-cols-2 border p-4">
                        <div>
                            <div className="font-medium text-green-600 flex items-center">
                                <IoCheckmarkCircleOutline className="mr-1" />
                                Produkt dostępny, {data?.Stock} szt.
                            </div>
                            <div className="mt-2">
                                <div className="text-3xl font-bold">
                                    {data?.PriceBrutto} zł
                                </div>
                                <div className="text-lg text-gray-600">{data?.PriceNetto} zł netto</div>
                            </div>
                        </div>
                        <div className="flex justify-end items-end space-x-2">
                            <NumberBox
                                min={1}
                                max={data?.Stock ?? 1}
                                width={120}
                                showSpinButtons={true}
                                className='py-1'
                                label="Ilość sztuk"
                                value={quantity}
                                onValueChanged={(e) => setQuantity(e.value)}
                            />
                            <Button text="Dodaj do koszyka" type='default' icon="cart" className="px-3 py-1" onClick={handleAddToCart} />
                        </div>
                    </div>
                </div>
            </div>
            <div>Product ID:777</div>

        </Container>
    );
}

export default Product;