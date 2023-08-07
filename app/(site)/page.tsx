import PageContent from "./components/PageContent";

export const revalidate = 0;

export default function Home() {
  return (
    <div className="flex h-full w-full justify-center items-center">
      <PageContent />
    </div>
  );
};
