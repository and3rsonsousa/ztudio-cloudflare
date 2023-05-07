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

export const meta: V2_MetaFunction = ({ data, matches }) => {
  const match = matches[0];

  return data.account
    ? [
        {
          title: `${data.account.name} no ᴢᴛᴜᴅɪᴏ`,
        },
      ]
    : match["meta"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { slug } = params;
  if (slug) {
    const { data: account } = await getAccount(request, slug);
    return { account };
  }
  return {};
};

export default function Slug() {
  const { account } = useLoaderData<{ account: AccountModel }>();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const context = useOutletContext();

  return account ? (
    <SlugLayout account={account} date={date}>
      <Outlet context={context} />
    </SlugLayout>
  ) : (
    <Outlet context={context} />
  );
}
