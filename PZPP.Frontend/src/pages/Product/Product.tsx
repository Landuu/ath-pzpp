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
        const itemIndex = cart.findIndex(x => x.ProductId == 1);
        if(itemIndex != -1) {
            cart[itemIndex].Quantity += quantity;
            setCart(cart);
        } else {
            const newItem: CartProduct = {
                ProductId: 1,
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
                    {/* <img src='https://cdn3.botland.com.pl/105021-pdt_540/kamera-arducam-ov5647-5mpx-z-obiektywem-ls-2718-cs-mount-dla-raspberry-pi.jpg' className="w-96" /> */}
                    <img src={data?.ImageUrl} className="w-96" />
                </div>
                <div>
                    <div className="text-xl font-medium">
                        {data?.Name}
                        {/* Kamera ArduCam OV5647 5Mpx z obiektywem LS-2718 CS mount - dla Raspberry Pi */}
                    </div>
                    <div className="space-x-2 text-gray-500">
                        <span>Numer produktu:</span>
                        <span className="font-bold">
                            {/* ACM-06628 */}
                            {data?.Id}
                        </span>
                    </div>
                    <div className="py-3 text-gray-800">
                        {data?.Description}
                        {/* Moduł kamery z sensorem OV5647 wyposażony w obiektyw LS-2718 CS mount o parametrach: ogniskowa 4.0 mm, kąt 93 ° , przesłona 1.4, format 1/2.5". Podłączany do dedykowanego złącza minikomputera Raspberry Pi w wersji 4B, 3B+, 3B, 3. Urządzenie posiada matrycę o rozdzielczości 5 Mpx, wspiera tryb HD 1080 px / 30 fps. */}
                    </div>
                    <div className="grid grid-cols-2 border p-4">
                        <div>
                            <div className="font-medium text-green-600 flex items-center">
                                <IoCheckmarkCircleOutline className="mr-1" />
                                Produkt dostępny, 4szt.
                            </div>
                            <div className="mt-2">
                                <div className="text-3xl font-bold">
                                    {data?.Price} zł
                                    {/* 73,12 zł */}
                                </div>
                                <div className="text-lg text-gray-600">59,21 zł netto</div>
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