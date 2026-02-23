import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [{ category: "_", slug: "_" }];
}

export default function Page({ params }: { params: Promise<{ category: string; slug: string }> }) {
  return <ClientPage params={params} />;
}
