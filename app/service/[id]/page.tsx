import getServiceById from "@/actions/getServiceById";
import Container from "@/components/Container";
import PageContent from "./components/PageContent";
import getAvailableDates from "@/actions/getAvailableDates";

interface IParams {
    id: string;
};

const ServicePage = async ({ params }: { params: IParams }) => {
    const service = await getServiceById(params.id);
    const availableDates = await getAvailableDates(params.id);

    return (
        <Container>
            <PageContent service={service} availableDates={availableDates} />
        </Container>
    );
};

export default ServicePage;