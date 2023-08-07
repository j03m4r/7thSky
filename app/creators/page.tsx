import getCreators from "@/actions/getCreators";
import Container from "@/components/Container";
import PageContent from "./components/PageContent";

export default async function CreatorsPage() {
	const creators = await getCreators();

    return (
		<Container>
			<PageContent creators={creators} />
		</Container>
    );
};