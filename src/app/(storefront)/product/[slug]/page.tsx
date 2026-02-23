import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [{ slug: "_" }];
}

export default function Page() {
  return <ClientPage />;
}
