import { Button } from "devextreme-react/button";
import { Link, Navigate } from "react-router-dom";
import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";

const CartSummary = () => {
    const {user} = useUserContext();
    if(!user)
        return <Navigate to='../' relative="path" />

    return (
        <Container className="my-10">
            <div className="mb-3">
                <Link to='/cart'>
                    <Button text='Powrót do koszyka' icon="back" stylingMode="text" />
                </Link>
            </div>
            <div>
                Summary
            </div>
        </Container>
    );
}
 
export default CartSummary;