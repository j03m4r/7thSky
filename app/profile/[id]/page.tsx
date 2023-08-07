import getUserByName from "@/actions/getUserByName";
import Container from "@/components/Container";
import PageContent from "./components/PageContent";
import getFavoritedGenres from "@/actions/getFavoritedGenres";
import getTracksByUser from "@/actions/getTracksByUser";

interface IParams {
    id: string;
};

const ProfilePage = async ({ params }: { params: IParams }) => {
    const user = await getUserByName(params.id);
    const genres = await getFavoritedGenres(params.id);
    const tracks = await getTracksByUser(params.id);

    return (
        <Container>
            <PageContent userDetails={user} favoriteGenres={genres} tracks={tracks} />
        </Container>
    );
};

export default ProfilePage;