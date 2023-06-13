import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import { CartProduct } from "../../types";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { atomCart } from "../../atoms";
import { NumberBox } from "devextreme-react/number-box";
import { CartProductDto } from "../../hooks/queries/useQueryCart";

type CartProductElementProps = {
    product: CartProductDto
    handleShowEdit: (product: CartProductDto) => void
    handleShowDelete: (product: CartProductDto) => void
}

const CartProductElement = ({product, handleShowEdit, handleShowDelete}: CartProductElementProps) => {
    return (<>
        <div className="flex items-center py-2 space-x-4">
            <div className="min-w-fit">
                <img className="w-14" src={product.ImageUrl} />
            </div>
            <div className="w-full text-lg">
                {product.Name}
            </div>
            <div className="min-w-fit pr-4 text-gray-400 font-medium">
                Ilość sztuk: {product.Quantity}
            </div>
            <div className="min-w-fit text-gray-700 font-medium space-x-1">
                <span>{product.PriceBrutto * product.Quantity} zł</span>
                <span className="text-gray-400">({product.Quantity} x {product.PriceBrutto})</span>
            </div>
            <div className="min-w-fit flex items-center space-x-1">
                <Button icon="edit" stylingMode="text" onClick={() => handleShowEdit(product)} />
                <Button icon="close" stylingMode="text" onClick={() => handleShowDelete(product)} />
            </div>
        </div>

        
    </>);
}


export default CartProductElement;