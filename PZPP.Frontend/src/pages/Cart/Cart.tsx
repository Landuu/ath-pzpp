import { Button } from "devextreme-react/button";
import { useAtom } from "jotai";
import { IoCar, IoCart, IoCartOutline } from "react-icons/io5";
import { atomCart } from "../../atoms";
import Container from "../../components/Container";
import { useToast } from "../../hooks/useToast";
import { useUserContext } from "../../hooks/useUserContext";
import CartProduct from "./CartProduct";

const Cart = () => {
    const { user } = useUserContext();
    const showToast = useToast();
    const [cart, setCart] = useAtom(atomCart);

    const handleFinalize = () => {
        showToast("Zakup");
    }

    const handleClear = () => {
        const confirmed = confirm("Czy na pewno chcesz usunąć wszystkie produkty z koszyka?");
        if(!confirmed) return;
        setCart([]);
    }

    return (
        <Container className='my-10 px-40 space-y-5'>
            <div className="flex items-center justify-between">
                <div className="text-2xl flex items-center space-x-1">
                    <IoCartOutline />
                    <span>Twój koszyk</span>
                </div>
                <div>
                    <Button icon="trash" text='Wyczyść koszyk' onClick={handleClear} />
                </div>
            </div>

            <div className="flex border">
                <div className="w-full p-5">
                    <CartProduct />
                    <CartProduct />
                    <CartProduct />
                </div>
                <div className="p-5 m-2 border">
                    <div className="font-medium text-gray-700 text-xl">Podsumowanie:</div>
                    <div className="text-lg flex space-x-2 mt-10">
                        <div>Razem:</div>
                        <div className="font-medium">777zł</div>
                    </div>
                    <div className="mt-3">
                        <Button icon="cart" text="Złóż zamówienie" type="success" onClick={handleFinalize} disabled={!user} />
                    </div>
                    {!user &&
                        <div className="text-sm mt-1 text-red-400 font-medium">
                            Zaloguj się, aby złożyć zamówienie
                        </div>
                    }
                </div>
            </div>
        </Container>
    );
}

export default Cart;