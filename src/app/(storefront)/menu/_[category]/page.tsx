import ClientPage from "./ClientPage";

export async function generateStaticParams() {
  return [];
}

export default function Page({ params }: { params: Promise<{ category: string }> }) {
  return <ClientPage params={params} />;
}
