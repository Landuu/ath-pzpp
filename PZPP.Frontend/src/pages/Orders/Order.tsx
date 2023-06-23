import { useQuery } from "@tanstack/react-query";
import { Button } from "devextreme-react/button";
import { List } from "devextreme-react/list";
import { IoPersonOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { axiosAuth } from "../../axiosClient";
import AccountNav from "../../components/AccountNav";
import Container from "../../components/Container";
import { formatDateTime } from '../../utils';
import css from './Order.module.css';
import Product from '../Product/Product';
import { Column, DataGrid } from "devextreme-react/data-grid";

interface OrderProductDto {
    ProductId: number
    ProductName: string
    Quantity: number
    Price: number
    PriceTotal: number
}

interface DeliveryOptionDto {
    Id: number
    Name: string
    Cost: number
    DisplayName: string
}

interface OrderDto {
    Id: number
    OrderDate: string
    DeliveryOptionId: number
    DeliveryOption: DeliveryOptionDto
    Street: string
    PostCode: string
    City: string
    Products: OrderProductDto[]
    TotalWithoutDelivery: number
    TotalWithDelivery: number
}

const Order = () => {
    const { id } = useParams();

    const { data } = useQuery<OrderDto>({
        queryFn: async () => (await axiosAuth.get(`/api/account/orders/${id}`)).data,
        queryKey: ['orders', id]
    })

    console.log(data);

    return (
        <Container className='my-8'>
            <div className="text-3xl flex items-center text-gray-700 p-3">
                <IoPersonOutline className="mr-2" />
                Twoje zamówienia
            </div>

            <div className="flex space-x-8">
                <AccountNav />

                {data &&
                    <div className="w-full flex flex-col border p-8">
                        <div className="mb-4">
                            <Link to='../' relative="path">
                                <Button text="Powrót do zamówień" icon="return" stylingMode="text" />
                            </Link>
                        </div>
                        <div className="text-2xl font-medium">Zamówienie nr. {id}</div>
                        <div className="mt-3 grid grid-cols-3">
                            <div>
                                <table className={css.detailsTable}>
                                    <tbody>
                                        <tr>
                                            <td>Status zamówienia:</td>
                                            <td>W realizacji</td>
                                        </tr>
                                        <tr>
                                            <td>Data zamówienia:</td>
                                            <td>{formatDateTime(data.OrderDate)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <table className={css.detailsTable}>
                                    <tbody>
                                        <tr>
                                            <td>Metoda dostawy:</td>
                                            <td>{data.DeliveryOption.Name}</td>
                                        </tr>
                                        <tr>
                                            <td>Ulica i numer:</td>
                                            <td>{data.Street}</td>
                                        </tr>
                                        <tr>
                                            <td>Miejscowość:</td>
                                            <td>{data.PostCode}, {data.City}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <table className={css.detailsTable}>
                                    <tbody>
                                        <tr>
                                            <td>Status płatności:</td>
                                            <td>Opłacone</td>
                                        </tr>
                                        <tr>
                                            <td>Kwota zamówienia:</td>
                                            <td>{data.TotalWithoutDelivery} zł</td>
                                        </tr>
                                        <tr>
                                            <td>Dostawa: </td>
                                            <td>{data.DeliveryOption.Cost} zł</td>
                                        </tr>
                                        <tr>
                                            <td>Razem: </td>
                                            <td>{data.TotalWithDelivery} zł</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-2 text-lg font-medium">Zamówione produkty:</div>
                        <div className="w-1/2 bg-red-500">
                            <DataGrid
                                dataSource={data?.Products}
                                showRowLines={true}
                            >
                                <Column dataField='ProductName' caption='Nazwa produktu' width='auto' />
                                <Column dataField='Quantity' caption='Ilość' />
                                <Column dataField='Price' caption='Cena' />
                                <Column dataField='PriceTotal' caption='Cena razem' />
                            </DataGrid>
                        </div>
                    </div>
                }


            </div>
        </Container>
    );
}

export default Order;