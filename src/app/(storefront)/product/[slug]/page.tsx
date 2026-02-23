import ClientPage from "./ClientPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { slug: "honey-bbq-kettle-chips" },
    { slug: "sea-salt-vinegar-crisps" },
    { slug: "double-chocolate-cookies" },
    { slug: "oatmeal-raisin-cookies" },
    { slug: "classic-meat-pie" },
    { slug: "spinach-puff-pastry" },
    { slug: "honey-roasted-almonds" },
    { slug: "trail-mix-energy-pack" },
    { slug: "gummy-bear-mix" },
    { slug: "caramel-popcorn-tub" },
    { slug: "kale-quinoa-bites" },
    { slug: "fresh-mango-smoothie" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
