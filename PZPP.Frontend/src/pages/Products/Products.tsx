import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { Button, TreeView } from "devextreme-react";
import { List } from "devextreme-react/list";
import DataSource from "devextreme/data/data_source";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";

export interface ProductDto {
    Id: number
    Name: string
    Description: string
    PriceNetto: number
    PriceBrutto: number
    ImageUrl: string
    Stock: number
}


export interface ProductCategoryDto {
    Id: number
    Name: string
}

const categoriesDataSource = createStore({
    loadUrl: '/api/products/categories',
    key: 'Id'
})

const Products = () => {
    const navigate = useNavigate();

    const dataSource = useRef(new DataSource({
        store: createStore({
            loadUrl: '/api/products',
            key: 'Id'
        })
    }));

    const { data } = useQuery({
        queryFn: async () => (await axios.get('/api/products/categories')).data,
        queryKey: ['products', 'categories']
    });

    const itemRender = (e: any) => {
        return (
            <div className="flex justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <img className="w-16" src={e.ImageUrl} alt="" />
                    </div>
                    <div>
                        <div>
                            {e.Name}
                        </div>
                        <div className="text-sm text-gray-400">
                            {e.Stock > 0
                                ? <div>W magazynie, {e.Stock} szt.</div>
                                : <div>Niedostępny</div>
                            }
                        </div>
                    </div>
                </div>

                <div className="flex items-center text-base">
                    {e.PriceBrutto} zł
                </div>
            </div>
        )
    }

    return (
        <Container className='my-10'>
            <div className="grid grid-cols-4 gap-5">
                <div>
                    <div className="mb-2">
                        <Button
                            icon="close"
                            text='Wyczyść filtry'
                            stylingMode="text"
                            onClick={() => {
                                dataSource.current.filter([]);
                                dataSource.current.load();
                            }}
                        />
                    </div>
                    <div className="mb-1">Kategorie:</div>
                    <div>
                        <TreeView
                            dataSource={categoriesDataSource}
                            keyExpr='Id'
                            displayExpr='Name'
                            onItemClick={(e) => {
                                if (!e.itemData) return;
                                dataSource.current.filter(['ProductCategoryId', '=', e.itemData.Id]);
                                dataSource.current.load();
                            }}
                        />
                    </div>
                </div>
                <div className="col-span-3">
                    <List
                        dataSource={dataSource.current}
                        searchExpr="Name"
                        searchEnabled={true}
                        searchMode='contains'
                        displayExpr='Name'
                        itemRender={itemRender}
                        onItemClick={(e) => navigate(`${e.itemData.Id}`)}
                        nextButtonText="Pokaż więcej..."
                        noDataText="Brak produktów"

                    />
                </div>
            </div>
        </Container>
    );
}

export default Products;