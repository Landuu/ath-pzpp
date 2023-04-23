import { Button } from "devextreme-react/button";
import { Link } from "react-router-dom";
import Container from "../../components/Container";

const Products = () => {
    return (
        <Container className='my-10'>
            <div>
                <span className="mr-5">Products!</span>
                <Link to='/product'>
                    <Button text='Product page' />
                </Link>
            </div>
        </Container>
    );
}

export default Products;