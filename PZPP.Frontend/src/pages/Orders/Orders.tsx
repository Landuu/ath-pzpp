import { createStore } from "devextreme-aspnet-data-nojquery";
import { List } from "devextreme-react/list";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AccountNav from "../../components/AccountNav";
import Container from "../../components/Container";
import { formatDateTime } from "../../utils";

const ordersDataSource = createStore({
    loadUrl: '/api/account/orders',
    key: 'Id'
});

const Order = () => {
    const navigate = useNavigate();

    const listItemRender = (e: any) => {
        return (
            <div className="flex justify-between px-5 font-medium">
                <div className="flex items-center gap-4">
                    <div>
                        <div>
                            Zamówienie numer {e.Id} z dnia {formatDateTime(e.OrderDate)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center text-base">
                    {e.TotalWithDelivery} zł
                </div>
            </div>
        )
    }

    return (
        <Container className='my-8'>
            <div className="text-3xl flex items-center text-gray-700 p-3">
                <IoPersonOutline className="mr-2" />
                Twoje zamówienia
            </div>

            <div className="flex space-x-8">
                <AccountNav />

                <div className="w-full flex flex-col border p-8">
                    <List
                        itemRender={listItemRender}
                        dataSource={ordersDataSource}
                        onItemClick={(e) => navigate(`${e.itemData.Id}`)}
                        noDataText="Brak zamówień"
                    />
                </div>

            </div>
        </Container>
    );
}

export default Order;