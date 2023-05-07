import type { LoaderFunction, V2_MetaFunction } from "@remix-run/cloudflare";

import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import SlugLayout from "~/components/SlugLayout";
import { getAccount } from "~/lib/data";
import type { AccountModel } from "~/lib/models";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: `${data.account.name} no ᴢᴛᴜᴅɪᴏ`,
    },
  ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data: account } = await getAccount(request, params.slug);

  return { account };
};

export default function Slug() {
  const { account } = useLoaderData<{ account: AccountModel }>();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");

  return (
    <SlugLayout account={account} date={date}>
      <Outlet context={useOutletContext()} />
    </SlugLayout>
  );
}
