import ClientPage from "./ClientPage";

export const dynamic = "force-dynamic";

export default function Page({ params }: { params: Promise<{ category: string }> }) {
  return <ClientPage params={params} />;
}
