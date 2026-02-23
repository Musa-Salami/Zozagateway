import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [{ category: "_" }];
}

export default function Page({ params }: { params: Promise<{ category: string }> }) {
  return <ClientPage params={params} />;
}
