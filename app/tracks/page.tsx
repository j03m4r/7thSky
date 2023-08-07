import Container from "@/components/Container";
import PageContent from "./components/PageContent";
import SearchMenuButton from "./components/SearchMenuButton";
import getTrackByParams from "@/actions/getTrackbyParams";
import { Genre } from "@/types";

export const revalidate = 0;

interface SearchProps {
  searchParams: {
      title: string;
      key: number;
      min: number;
      max: number;
      genres: Genre[];
  }
};

export default async function TracksPage({ searchParams }: SearchProps) {
  const tracks = await getTrackByParams(searchParams);

  return (
    <Container>
      <SearchMenuButton />
      <PageContent tracks={tracks} />
    </Container>
  );
};