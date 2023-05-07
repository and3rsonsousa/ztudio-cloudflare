import type { ActionFunction } from "@remix-run/cloudflare";
import { handleAction } from "~/lib/data";

export const action: ActionFunction = async ({ request, context, params }) => {
  const formData = await request.formData();

  const { data, error } = await handleAction(formData, request, context);

  return { data, error };
};
