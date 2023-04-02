import { Button } from "devextreme-react/button";
import { NumberBox } from "devextreme-react/number-box";
import Popup from "devextreme-react/popup";
import { useAtom } from "jotai";
import { useState } from "react";
import { IoCar, IoCart, IoCartOutline } from "react-icons/io5";
import { atomCart } from "../../atoms";
import Container from "../../components/Container";
import { useToast } from "../../hooks/useToast";
import { useUserContext } from "../../hooks/useUserContext";
import { CartProduct } from "../../types";
import CartProductElement from "./CartProduct";

const Cart = () => {
    const { user } = useUserContext();
    const showToast = useToast();
    const [cart, setCart] = useAtom(atomCart);
    const [showClear, setShowClear] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(null);
    const [editQuantity, setEditQuantity] = useState(0);

    const handleFinalize = () => {
        showToast("Zakup");
    }

    const handleClear = () => {
        setCart([]);
        setShowClear(false);
    }

    const handleShowEdit = (product: CartProduct) => {
        setSelectedProduct(product);
        setEditQuantity(product.Quantity);
        setShowEdit(true);
    }

    const handleShowDelete = (product: CartProduct) => {
        setSelectedProduct(product);
        setShowDelete(true);
    }

    const handleHideModal = () => {
        setShowEdit(false);
        setShowDelete(false);
        setSelectedProduct(null);
    }

    return (<>
        <Container className='my-10 space-y-5'>
            <div className="flex items-center justify-between">
                <div className="text-2xl flex items-center space-x-1">
                    <IoCartOutline />
                    <span>Twój koszyk</span>
                </div>
                <div>
                    <Button icon="trash" text='Wyczyść koszyk' onClick={() => setShowClear(true)} />
                </div>
            </div>

            <div className="flex border">
                <div className="w-full p-5">
                    {cart.length == 0 && <>
                        <div>
                            Brak produktów w koszyku!
                        </div>
                    </>}
                    {cart.map((product, index) => <CartProductElement product={product} handleShowEdit={handleShowEdit} handleShowDelete={handleShowDelete} key={index} />)}
                </div>
                <div className="p-5 m-2 border">
                    <div className="font-medium text-gray-700 text-xl">Podsumowanie:</div>
                    <div className="text-lg flex space-x-2 mt-10">
                        <div>Razem:</div>
                        <div className="font-medium">777zł</div>
                    </div>
                    <div className="mt-3">
                        <Button icon="cart" text="Złóż zamówienie" type="success" onClick={handleFinalize} disabled={!user || cart.length == 0} />
                    </div>
                    {!user &&
                        <div className="text-sm mt-1 text-red-400 font-medium">
                            Zaloguj się, aby złożyć zamówienie
                        </div>
                    }
                </div>
            </div>
        </Container>

        <Popup width='auto' height='auto' visible={showClear} showTitle={false} onHidden={handleHideModal} dragEnabled={false} hideOnOutsideClick={true}>
            <div className="flex flex-col space-y-5">
                <div className="flex justify-center">Czy na pewno chcesz wyczyścić koszyk?</div>
                <div className="space-x-4 flex justify-center">
                    <Button text='Anuluj' icon="close" onClick={handleHideModal} />
                    <Button text='Wyczyść koszyk' icon="trash" type="danger" onClick={handleClear} />
                </div>
            </div>
        </Popup>

        <Popup width='300' height='auto' visible={showEdit} showTitle={false} onHidden={handleHideModal} dragEnabled={false} hideOnOutsideClick={true}>
            <div className="flex flex-col space-y-5">
                <div className="text-center">Wpisz nową ilość szutuk:</div>
                <div className="flex justify-center">
                    <NumberBox
                        width={128}
                        value={editQuantity}
                        onValueChanged={(e) => setEditQuantity(e.value)}
                        min={1}
                        max={20}
                        showSpinButtons={true}
                    />
                </div>
                <div className="space-x-4 flex justify-center">
                    <Button text='Anuluj' icon="close" onClick={handleHideModal} />
                    <Button text='Potwierdź' icon="check" type="default" onClick={() => {
                        const newCart = cart.map(prod => {
                            if(prod.ProductId == selectedProduct?.ProductId) {
                                const newProduct: CartProduct = {...selectedProduct, Quantity: editQuantity};
                                return newProduct;
                            } else {
                                return prod;
                            }
                        });
                        setCart(newCart);
                        handleHideModal();
                    }} />
                </div>
            </div>
        </Popup>

        <Popup width='auto' height='auto' visible={showDelete} showTitle={false} onHidden={() => setShowDelete(false)} dragEnabled={false} hideOnOutsideClick={true}>
            <div className="flex flex-col space-y-5">
                <div>Czy na pewno chcesz usunąć ten produkt z koszyka?</div>
                <div className="space-x-4 flex justify-center">
                    <Button text='Anuluj' icon="close" onClick={() => setShowDelete(false)} />
                    <Button text='Usuń' icon="trash" type="danger" onClick={() => {
                        const newCart = cart.filter(prod => prod.ProductId != selectedProduct?.ProductId);
                        setCart(newCart);
                        handleHideModal();
                    }} />
                </div>
            </div>
        </Popup>
    </>);
}

export default Cart;