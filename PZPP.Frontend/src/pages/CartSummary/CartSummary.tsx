import { Button } from "devextreme-react/button";
import { IoCardOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";
import { CartProductDto } from "../../hooks/queries/useQueryCart";
import SummaryProduct from "./components/SummaryProduct";
import { RadioGroup } from "devextreme-react/radio-group";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCart } from "../../hooks/useCart";
import { axiosAuth } from "../../axiosClient";

interface UserInfoDto {
    FirstName: string
    LastName: string
    Email: string | null
    Phone: string | null
    Street: string | null
    PostCode: string | null
    City: string | null
}

interface DeliveryOptionDto {
    Id: number
    Name: string
    DisplayName: string
    Cost: number
}

interface OrderSummaryDto {
    Cart: CartProductDto[] | null
    UserInfo: UserInfoDto | null
    DeliveryOptions: DeliveryOptionDto[]
}

const CartSummary = () => {
    const { user } = useUserContext();
    if (!user) return <Navigate to='../' relative="path" />

    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [delivery, setDelivery] = useState<number | null>(null);
    const { data, isLoading, isError } = useQuery<OrderSummaryDto>({
        queryFn: async () => {
            const cart = window.localStorage.getItem('cart') ?? '[]';
            const res = await axiosAuth.get('/api/orders/summary', {
                params: {
                    cart: btoa(cart)
                }
            })
            return res.data;
        },
        queryKey: ['cart', 'summary']
    });

    const orderMutation = useMutation({
        mutationFn: async () => {
            setLoading(true);

            const cartBase64 = btoa(window.localStorage.getItem('cart') ?? '[]');
            const payload = {
                cart: cartBase64,
                deliveryOptionId: delivery
            }

            return (await axiosAuth.post('/api/orders/summary', payload)).data;
        },
        onSettled: () => setLoading(false),
        onSuccess: (data: number) => {
            clearCart();
            navigate(`/orders/${data}`);
        }
    });

    const getDeliveryCost = () => {
        return data?.DeliveryOptions.find(x => x.Id == delivery)?.Cost ?? 0;
    }

    const getTotal = () => {
        let sum = 0;
        if (!data || !data.Cart) return sum;
        data.Cart.forEach(p => sum += (p.PriceBrutto * p.Quantity));
        return sum.toFixed(2);
    }

    const getTotalWithDelivery = () => {
        const sum = getTotal();
        const total = Number(sum) + getDeliveryCost();
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
                <div className="flex">
                    <div className="w-full flex flex-col gap-5">
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
                                    dataSource={data.DeliveryOptions}
                                    value={delivery}
                                    onValueChanged={(e) => setDelivery(e.value)}
                                    displayExpr='DisplayName'
                                    valueExpr='Id'
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-96 border px-5 py-8">
                        <div className="text-xl text-center font-medium mb-5">
                            Podsumowanie
                        </div>
                        <div className="px-5 py-1">
                            <div>
                                <div>Produkty: <b>{getTotal()}zł</b></div>
                                <div>Dostawa: <b>{getDeliveryCost().toFixed(2)}zł</b></div>
                                <div className="mt-3 font-medium">Razem: <b>{getTotalWithDelivery()}zł</b></div>
                            </div>
                            <div className="mt-2">
                                <Button
                                    icon='cart'
                                    text="Zamów i zapłać"
                                    type="success"
                                    disabled={!delivery || loading}
                                    width='100%'
                                    onClick={() => orderMutation.mutate()}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            }

        </Container>
    );
}

export default CartSummary;