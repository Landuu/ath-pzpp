import Container from "../../components/Container"
import { useUserContext } from "../../hooks/useUserContext";

const Index = () => {
    const {user} = useUserContext();

    return (
        <Container className="my-8">
            <div>Index, {user}</div>
        </Container>
    );
}
 
export default Index;