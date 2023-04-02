import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import { CartProduct } from "../../types";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { atomCart } from "../../atoms";
import { NumberBox } from "devextreme-react/number-box";

type CartProductElementProps = {
    product: CartProduct
    handleShowEdit: (product: CartProduct) => void
    handleShowDelete: (product: CartProduct) => void
}

const CartProductElement = ({product, handleShowEdit, handleShowDelete}: CartProductElementProps) => {
    return (<>
        <div className="flex items-center py-2 space-x-4">
            <div className="min-w-fit">
                <img className="w-14" src='https://cdn3.botland.com.pl/105021-pdt_540/kamera-arducam-ov5647-5mpx-z-obiektywem-ls-2718-cs-mount-dla-raspberry-pi.jpg' />
            </div>
            <div className="w-full text-lg">
                Komputer przenośny Berryrasp 4c
            </div>
            <div className="min-w-fit pr-4 text-gray-400 font-medium">
                Ilość sztuk: {product.Quantity}x
            </div>
            <div className="min-w-fit text-gray-700 font-medium space-x-1">
                <span>390,99 zł</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-400">173,00 zł</span>
            </div>
            <div className="min-w-fit flex items-center space-x-1">
                <Button icon="edit" stylingMode="text" onClick={() => handleShowEdit(product)} />
                <Button icon="close" stylingMode="text" onClick={() => handleShowDelete(product)} />
            </div>
        </div>

        
    </>);
}


export default CartProductElement;