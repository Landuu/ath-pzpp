import { Button } from "devextreme-react/button";
import { IoCardOutline, IoCartOutline } from "react-icons/io5";
import { Link, Navigate } from "react-router-dom";
import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";
import { CartProductDto, useQueryCart } from "../../hooks/queries/useQueryCart";
import SummaryProduct from "./components/SummaryProduct";
import { RadioGroup } from "devextreme-react/radio-group";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserInfoDto {
    FirstName: string
    LastName: string
    Email: string | null
    Phone: string | null
    Street: string | null
    PostCode: string | null
    City: string | null
}

interface OrderSummaryDto {
    Cart: CartProductDto[] | null
    UserInfo: UserInfoDto | null
}

const CartSummary = () => {
    const { user } = useUserContext();
    if (!user)
        return <Navigate to='../' relative="path" />

    const [delivery, setDelivery] = useState<number | null>(null);
    const {data, isLoading, isError} = useQuery<OrderSummaryDto>({
        queryFn: async () => {
            const cart = window.localStorage.getItem('cart') ?? '[]';
            const res = await axios.get('/api/orders/summary', {
                params: {
                    cart: btoa(cart)
                }
            })
            return res.data;
        },
        queryKey: ['cart', 'summary']
    });

    const getTotal = () => {
        let sum = 0;
        if (!data || !data.Cart) return sum;
        data.Cart.forEach(p => sum += (p.PriceBrutto * p.Quantity));
        return sum.toFixed(2);
    }
    const getTotalWithDelivery = () => {
        const sum = getTotal();
        const total = Number(sum) + (delivery ?? 0);
        return total.toFixed(2);
    }

    return (
        <Container className='my-10 space-y-5'>
            <div className="flex items-center justify-between">
                <div className="text-2xl flex items-center space-x-1">
                    <IoCardOutline />
                    <span>Podsumowanie zamówienia</span>
                </div>
                <div>
                    <Link to='../' relative="path">
                        <Button icon="return" text='Powrót do koszyka' />
                    </Link>
                </div>
            </div>
            {!isLoading && !isError &&
                <div className="flex flex-col gap-5">
                    <div>
                        <div className="text-lg font-medium">
                            - Produkty w zamówieniu:
                        </div>
                        <div className="px-5 py-1 max-w-5xl">
                            {data?.Cart?.map((x, index) =>
                                <SummaryProduct product={x} key={index} />
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="text-lg font-medium">
                            - Dane do wysyłki:
                        </div>
                        <div className="px-5 py-1">
                            <p>Jan Kowalski</p>
                            <p>884 432 942</p>
                            <p>ul. Makowa 541/4</p>
                            <p>33-432 Wilkowice</p>
                        </div>
                    </div>
                    <div>
                        <div className="text-lg font-medium">
                            - Metoda dostawy:
                        </div>
                        <div className="px-5 py-1">
                            <RadioGroup
                                items={[
                                    {
                                        name: 'Poczta Polska - paczka pocztowa (+10zł)',
                                        value: 10
                                    },
                                    {
                                        name: 'Poczta Polska - paczka pocztowa za pobraniem (+15zł)',
                                        value: 15
                                    },
                                    {
                                        name: 'Kurier DPD (+20zł)',
                                        value: 20
                                    },
                                    {
                                        name: 'Kurier DPD - za pobraniem (+25zł)',
                                        value: 25
                                    }
                                ]}
                                value={delivery}
                                onValueChanged={(e) => setDelivery(e.value)}
                                displayExpr='name'
                                valueExpr='value'
                            />
                        </div>
                    </div>
                    <div>
                        <div className="text-lg font-medium">
                            - Podsumowanie:
                        </div>
                        <div className="px-5 py-1">
                            <div>
                                <div>Produkty: <b>{getTotal()}zł</b></div>
                                <div>Dostawa: <b>{delivery ?? '0'}zł</b></div>
                            </div>
                            <div className="flex gap-5 text-lg items-center">
                                <div>Razem: <b>{getTotalWithDelivery()}zł</b></div>
                                <div>
                                    <Button icon='cart' text="Zamów i zapłać" type="success" disabled={!delivery} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </Container>
    );
}

export default CartSummary;