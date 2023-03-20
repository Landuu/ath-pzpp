import { IoPersonOutline } from "react-icons/io5";
import AccountNav from "../../components/AccountNav";
import Container from "../../components/Container";

const Order = () => {
    return ( 
        <Container className='my-8'>
            <div className="text-3xl flex items-center text-gray-700 p-3">
                <IoPersonOutline className="mr-2" />
                Twoje zamówienia
            </div>

            <div className="flex space-x-8">
                <AccountNav />

                <div className="w-full flex flex-col space-y-10 border p-8">
                    Tutaj będą zamówienia PeepoGlad
                </div>

            </div>
        </Container>
    );
}
 
export default Order;