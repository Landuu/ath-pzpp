import { useQuery } from "@tanstack/react-query";
import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";
import axios from "axios";
import { ProductDto } from "../Products/Products";
import { Link } from "react-router-dom";
import { IoFlameOutline } from "react-icons/io5";

const Index = () => {
    const { user } = useUserContext();

    const {data} = useQuery<ProductDto[]>({
        queryFn: async () => (await axios.get('/api/products/random')).data,
        queryKey: ['homepage'],
        refetchOnWindowFocus: false
    })

    return (
        <Container className="my-8">
            {user && <div>Witaj {user.Name}!</div>}
            <div className="text-2xl flex items-center gap-2">
                <IoFlameOutline />
                Polecane produkty
            </div>
            <div className="mt-3 grid grid-cols-6 gap-5">
                {data?.map(x => 
                <Link to={`/products/${x.Id}`} key={x.Id}>
                    <div className="p-6 hover:bg-gray-100">
                        <img src={x.ImageUrl} />
                        <div className="text-center text-lg font-medium">{x.PriceBrutto} zł</div>
                        <div>{x.Name}</div>
                    </div>
                    </Link>
                )}
            </div>
        </Container>
    );
}

export default Index;