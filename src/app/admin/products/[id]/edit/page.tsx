import ClientPage from "./ClientPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { id: "p1" }, { id: "p2" }, { id: "p3" }, { id: "p4" },
    { id: "p5" }, { id: "p6" }, { id: "p7" }, { id: "p8" },
    { id: "p9" }, { id: "p10" }, { id: "p11" }, { id: "p12" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
