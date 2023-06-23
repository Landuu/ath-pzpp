import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "devextreme-react/button";
import { NumberBox } from 'devextreme-react/number-box';
import { useState } from "react";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/Container";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import { ProductDto } from "../Products/Products";

const Product = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const { cart, addCartProduct, getCartProduct, setCartProductQuantity } = useCart();
    const showToast = useToast();

    const { data } = useQuery<ProductDto>({
        queryFn: async () => await (await axios.get('/api/products/' + id)).data,
        queryKey: ['products', id]
    })

    const handleAddToCart = () => {
        if (!data) return;
        if (!data.Stock) return;

        const currentProduct = getCartProduct(data.Id);
        if (!currentProduct) {
            addCartProduct(data.Id, quantity);
            showToast(`Dodano ${quantity} szt. do koszyka!`, "success");
        } else {
            let newQuantity = currentProduct.q + quantity;
            if (newQuantity > data.Stock) {
                newQuantity = data.Stock;
                showToast(`W koszyku znajduje się teraz maksymalna ilość: ${data.Stock} szt.`);
            } else {
                showToast(`Dodano ${quantity} szt. do koszyka!`, "success");
            }
            setCartProductQuantity(data.Id, newQuantity);
        }

        setQuantity(1);
    }

    const isStock = () => {
        if (!data || !data.Stock) return false;
        if (data.Stock <= 0) return false;
        else return true;
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
                            {isStock() &&
                                <div className="font-medium text-green-600 flex items-center">
                                    <IoCheckmarkCircleOutline className="mr-1" />
                                    Produkt dostępny, {data?.Stock} szt.
                                </div>
                            }
                            {!isStock() &&
                                <div className="font-medium text-gray-600 flex items-center">
                                    <IoCloseCircleOutline className="mr-1" />
                                    Produkt niedostępny
                                </div>
                            }
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
                            <Button
                                text="Dodaj do koszyka"
                                type='default'
                                icon="cart"
                                className="px-3 py-1"
                                onClick={handleAddToCart}
                                disabled={!isStock()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Product;