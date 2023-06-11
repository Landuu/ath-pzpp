import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { List } from "devextreme-react/list";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Button } from "devextreme-react";
import DataSource from "devextreme/data/data_source";

export interface ProductDto {
    Id: number
    Name: string
    Description: string
    Price: number
    ImageUrl: string
    Stock: number
}

const Products = () => {
    const navigate = useNavigate();

    const dataSource = useRef(new DataSource({
        store: createStore({
            loadUrl: '/api/products',
            key: 'Id'
        })
    }))
    
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
                    {e.Price} zł
                </div>
            </div>
        )
    }

    return (
        <Container className='my-10'>
            <div className="grid grid-cols-4">
                <div>
                    <div>Kategorie:</div>
                    <div>
                        <Button 
                            text='filtr'
                            onClick={() => {
                                dataSource.current.filter(['Stock', '=', 8]);
                                dataSource.current.load();
                            }}
                        />
                        <Button 
                            text='clear'
                            onClick={() => {
                                dataSource.current.filter([]);
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