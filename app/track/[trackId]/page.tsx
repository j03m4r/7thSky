import getTrackById from "@/actions/getTrackById";
import Container from "@/components/Container";
import PageContent from "./components/PageContent";
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";

interface IParams {
    trackId: string;
};

const TrackPage = async ({ params }: { params: IParams }) => {
    const track = await getTrackById(params.trackId);
    const products = await getActiveProductsWithPrices();

    return (
        <Container>
            <PageContent track={track} products={products} />
        </Container>
    );
};

export default TrackPage;