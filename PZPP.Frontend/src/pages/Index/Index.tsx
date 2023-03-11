import { useEffect } from "react";
import Container from "../../components/Container"
import { useUserContext } from "../../hooks/useUserContext";

const Index = () => {
    const {user} = useUserContext();

    return (
        <Container className="my-8">
            {user ? <div>Urżytkownik zalogowany jako {user}</div> : <div>Nie zalogowano</div>}
        </Container>
    );
}
 
export default Index;