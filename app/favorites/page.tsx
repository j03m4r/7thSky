import Container from "@/components/Container";
import PageContent from "./components/PageContent";
import getFavoritedTracks from "@/actions/getFavoritedTracks";

export const revalidate = 0;

export default async function FavoritesPage() {
    const tracks = await getFavoritedTracks();

    return (
        <Container>
            <PageContent tracks={tracks} />
        </Container>
    );
};