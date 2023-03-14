import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";

const Index = () => {
    const { user } = useUserContext();

    return (
        <Container className="my-8">
            {user ? <div>Witaj {user.Name}!</div> : <div>Witaj! Zaloguj się, aby skorzystać z naszego sklepu</div>}
        </Container>
    );
}

export default Index;