import type { ActionFunction } from "@remix-run/cloudflare";
import { handleAction } from "~/lib/data";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const { data, error } = await handleAction(formData, request);

  return { data, error };
};
