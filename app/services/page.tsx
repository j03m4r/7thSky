import Container from "@/components/Container";
import PageContent from "./components/PageContent";
import getServices from "@/actions/getServices";


export default async function ServicesPage() {
	const services = await getServices();

	return (
		<Container>
			<PageContent services={services} />
		</Container>
	);
};