import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import { CartProduct } from "../../types";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { atomCart } from "../../atoms";
import { NumberBox } from "devextreme-react/number-box";

const CartProductElement = ({product}: {product: CartProduct}) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (<>
        <div className="flex items-center py-2 space-x-4">
            <div className="min-w-fit">
                <img className="w-14" src='https://cdn3.botland.com.pl/105021-pdt_540/kamera-arducam-ov5647-5mpx-z-obiektywem-ls-2718-cs-mount-dla-raspberry-pi.jpg' />
            </div>
            <div className="w-full text-lg">
                Komputer przenośny Berryrasp 4c
            </div>
            <div className="min-w-fit pr-4 text-gray-400 font-medium">
                Ilość sztuk: 4x
            </div>
            <div className="min-w-fit text-gray-700 font-medium space-x-1">
                <span>390,99 zł</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-400">173,00 zł</span>
            </div>
            <div className="min-w-fit flex items-center space-x-1">
                <Button text='edit' icon="edit" type="back" stylingMode="text" onClick={() => setShowEdit(true)} />
                <Button text='delete' icon="close" type="back" stylingMode="text" onClick={() => setShowDelete(true)} />
            </div>
        </div>

        <Popup width='300' height='auto' visible={showEdit} showTitle={false} onHidden={() => setShowEdit(false)} dragEnabled={false} hideOnOutsideClick={true}>
            <div className="flex flex-col space-y-5">
                <div className="text-center">Wpisz nową ilość szutuk:</div>
                <div className="flex justify-center">
                    <NumberBox
                        width={128}
                        defaultValue={product.Quantity}
                        min={1}
                        max={20}
                        showSpinButtons={true}
                    />
                </div>
                <div className="space-x-4 flex justify-center">
                    <Button text='Potwierdź' icon="check" type="default" />
                    <Button text='Anuluj' icon="close" onClick={() => setShowEdit(false)} />
                </div>
            </div>
        </Popup>
        <Popup width='auto' height='auto' visible={showDelete} showTitle={false} onHidden={() => setShowDelete(false)} dragEnabled={false} hideOnOutsideClick={true}>
            <div className="flex flex-col space-y-5">
                <div>Czy na pewno chcesz usunąć ten produkt z koszyka?</div>
                <div className="space-x-4 flex justify-center">
                    <Button text='Usuń' icon="trash" type="danger" />
                    <Button text='Anuluj' icon="close" onClick={() => setShowDelete(false)} />
                </div>
            </div>
        </Popup>
    </>);
}


export default CartProductElement;