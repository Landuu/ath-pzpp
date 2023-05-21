import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";

export interface ProductDto {
    Id: number
    Name: string
    Description: string
    Price: number
    ImageUrl: string
}

const Products = () => {
    const { data } = useQuery<ProductDto[]>({
        queryFn: async () => await (await axios.get('/api/products')).data,
        queryKey: ['products']
    });

    useEffect(() => {
        console.log(data);
    }, [data])

    return (
        <Container className='my-10'>
            <div className="grid grid-cols-4">
                <div>Kategorie:</div>
                <div className="col-span-3 flex flex-col gap-2">
                    {data?.map((p, index) =>
                        <Link to={p.Id.toString()}>
                        <div className='flex justify-between px-8 py-2 hover:bg-gray-100 hover:cursor-pointer' key={index}>
                            <div className="flex gap-5">
                                <div>
                                    <img className="h-16" src={p.ImageUrl} />
                                </div>
                                <div className="text-lg flex items-center">
                                {p.Name}
                                </div>
                            </div>
                            <div className="text-xl">
                                {p.Price} PLN
                            </div>
                        </div>
                        </Link>
                    )}
                </div>
            </div>
        </Container>
    );
}

export default Products;