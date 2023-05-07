import dayjs from "dayjs";
import { getMonth, getWeek, getYear } from "./functions";
import { getSupabase } from "./supabase";

const SQL__GET__ACTION = `*, account:Account!inner(*), category:Category(*), stage:Stage(*), campaign:Campaign(*), creator:Person!Action_creator_fkey(*), responsible:Person!Action_responsible_fkey(*) order by date`;

const SQL__GET__ACTION_ONLY_ID = `date, account!inner(slug)`;

// Simplificar para apenas dois
export const getPerson = (id: string, request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase.from("Person").select("*").eq("id", id).single();
};

export const getPersonByUser = (id: string, request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase.from("Person").select("*").eq("user", id).single();
};

export const getPersons = (request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase.from("Person").select("*").order("name", { ascending: true });
};

// Simplificar para 2

export const getAccount = async (
  request: Request,
  slug?: string,
  id?: string
) => {
  const { supabase } = getSupabase(request);
  if (id) {
    return supabase.from("Account").select("*").eq("id", id).single();
  }
  return supabase.from("Account").select("*").eq("slug", slug).single();
};

export const getAccounts = (userId: string, request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase
    .from("Account")
    .select("*")
    .contains("users", [userId])
    .order("name", {
      ascending: true,
    });
};

export const getAllAccounts = (request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase.from("Account").select("*").order("name", {
    ascending: true,
  });
};

export const getCategoriesStagesAttributes = async (request: Request) => {
  const { supabase } = getSupabase(request);
  const [{ data: categories }, { data: stages }, { data: attributes }] =
    await Promise.all([
      supabase
        .from("Category")
        .select("*")
        .order("priority", { ascending: true }),
      supabase.from("Stage").select("*").order("priority", { ascending: true }),
      supabase
        .from("Attribute")
        .select("*")
        .order("priority", { ascending: true }),
    ]);

  return { categories, stages, attributes };
};

export const getActions = async (
  args: {
    request?: Request;
    user?: string;
    account?: string;
    period?: string | null;
    mode?: "year" | "week" | "day" | "month";
    all?: boolean;
    where?: string;
  } = {}
) => {
  let { user, account, period, request, all, where, mode } = args;

  if (!request) {
    return { error: { message: "Request is undefined" } };
  }
  const { supabase } = getSupabase(request);

  if (all) {
    if (account) {
      const { data, error } = await supabase
        .from("Action")
        .select(SQL__GET__ACTION)
        .eq("Account.slug", account)
        .is("deleted", null)
        .order("date", {
          ascending: true,
        })
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);

      return { data, error };
    }

    if (where === "trash") {
      const { data, error } = await supabase
        .from("Action")
        .select(SQL__GET__ACTION)
        .eq("deleted", "true")
        .order("updated_at", {
          ascending: true,
        });

      if (error) throw new Error(error.message);

      return { data, error };
    }

    const { data, error } = await supabase
      .from("Action")
      .select(SQL__GET__ACTION)
      .is("deleted", null)
      .order("date", {
        ascending: true,
      })
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return { data, error };
  }

  const { firstDayOfPeriod, lastDayOfPeriod } =
    mode === "year"
      ? getYear({ period })
      : mode === "week"
      ? getWeek({ period })
      : mode === "day"
      ? { firstDayOfPeriod: dayjs(period), lastDayOfPeriod: dayjs(period) }
      : getMonth({ period });

  if (account) {
    const { data } = await supabase
      .from("Action")
      .select(mode === "year" ? SQL__GET__ACTION_ONLY_ID : SQL__GET__ACTION)
      .eq("account.slug", account)
      .is("deleted", null)
      .gte("date", firstDayOfPeriod.format("YYYY/MM/DD 00:00:00"))
      .lte("date", lastDayOfPeriod.format("YYYY/MM/DD 23:59:59"))
      .order("date", {
        ascending: true,
      })
      .order("created_at", { ascending: true });

    return { data };
  } else {
    if (!user) {
      return { error: { message: "User is undefined" } };
    }

    const { data, error } = await supabase
      .from("Action")
      .select(mode === "year" ? SQL__GET__ACTION_ONLY_ID : SQL__GET__ACTION)
      .contains("Account.users", [user])
      .is("deleted", null)
      .gte("date", firstDayOfPeriod.format("YYYY/MM/DD 00:00:00"))
      .lte("date", lastDayOfPeriod.format("YYYY/MM/DD 23:59:59"))
      .order("date", {
        ascending: true,
      })
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return { data };
  }
};

export const getAction = async (request: Request, id: string) => {
  const { supabase } = getSupabase(request);
  const { data, error } = await supabase
    .from("Action")
    .select(SQL__GET__ACTION)
    .eq("id", id)
    .single();

  return { data, error };
};

export const getCelebrations = async (
  args: {
    request?: Request;
  } = {}
) => {
  let { request } = args;

  if (!request) {
    throw new Error("Request is undefined");
  }

  const { supabase } = getSupabase(request);

  return supabase.from("Celebration").select("*").order("is_holiday");
};

export const getCampaign = async (request: Request, id: string) => {
  const { supabase } = getSupabase(request);
  const { data, error } = await supabase
    .from("Campaign")
    .select(
      "*, Action!inner(*), Account!Campaign_account_fkey!inner(*), stage:Stage!Campaign_stage_fkey!inner(*)"
    )
    .eq("id", id)
    .single();

  return { data, error };
};

export const getCampaigns = async (
  args: {
    request?: Request;
    user?: string;
    account?: string;
  } = {}
) => {
  let { request, user, account } = args;

  if (!request) {
    throw new Error("Request is undefined");
  }

  const { supabase } = getSupabase(request);

  // TODO:
  // Filtrar campanhas pelas contas que o usuário tem acesso
  if (account) {
    const { data, error } = await supabase
      .from("Campaign")
      .select(
        "*, Account!Campaign_account_fkey!inner(*),state:Campaign_stage_fkey(*)"
      )

      .eq("Account.slug", account)
      .is("deleted", null)
      .order("date_start", {
        ascending: true,
      });

    return { data, error };
  } else {
    if (!user) {
      throw new Error("User is undefined");
    }
    const { data, error } = await supabase
      .from("Campaign")
      .select(
        "*, Account!Campaign_account_fkey!inner(*), stage:Campaign_stage_fkey(*)"
      )

      .contains("Account.users", [user])
      .is("deleted", null)
      .order("date_start", {
        ascending: true,
      });

    if (error) throw new Error(error.message);

    return { data, error };
  }
};

async function createCelebration(formData: FormData, request: Request) {
  const { supabase } = getSupabase(request);

  let name = formData.get("name");
  let date = formData.get("date") as string;
  if (name === "" || date === "") {
    return {
      error: {
        message: "Nome ou Data está em branco",
      },
    };
  }

  let dateSplit = date.split("/");

  const { data, error } = await supabase
    .from("Celebration")
    .insert({
      name: name,
      date: `${dateSplit[1]}/${dateSplit[0]}`,
      is_holiday: !!formData.get("is_holiday"),
    })
    .select()
    .single();

  return {
    data,
    error,
  };
}

export const handleAction = async (formData: FormData, request: Request) => {
  const action = formData.get("action") as string;
  const { supabase } = getSupabase(request);

  if (action.match(/create-/)) {
    // Celebration
    if (action === "create-celebration") {
      return await createCelebration(formData, request);
    } else if (action === "create-action") {
      const creator = formData.get("creator");
      const name = formData.get("name");
      const account = formData.get("account");
      const campaign = formData.get("campaign");
      const description = formData.get("description");
      const category = formData.get("category");
      const stage = formData.get("stage");
      const date = formData.get("date");

      const values = {
        creator: creator,
        responsible: creator,
        name,
        account,
        campaign: campaign ? campaign : null,
        description,
        category,
        stage,
        date,
      };

      if (name === "") {
        return {
          error: {
            message: "Coloque o nome da ação.",
          },
        };
      }
      if (account === "") {
        return {
          error: {
            message: "Escolha um cliente.",
          },
        };
      }

      const { data, error } = await supabase
        .from("Action")
        .insert(values)
        .select("*")
        .single();

      return { data, error };
    } else if (action === "create-campaign") {
      const creator = formData.get("creator");
      const name = formData.get("name");
      const account = formData.get("account");
      const description = formData.get("description");
      const date_start = formData.get("date_start");
      const date_end = formData.get("date_end");
      const stage = formData.get("stage");

      const values = {
        creator: creator,
        name,
        account,
        description,
        date_start,
        date_end,
        stage,
      };

      if (name === "") {
        return {
          error: {
            message: "Coloque o nome da campanha.",
          },
        };
      }
      if (account === "") {
        return {
          error: {
            message: "Escolha um cliente.",
          },
        };
      }

      const { data, error } = await supabase
        .from("Campaign")
        .insert(values)
        .select("*")
        .single();

      return { data, error };
    }
  } else if (action.match(/update-/)) {
    const id = formData.get("id") as string;
    let values = {};
    let table = "";
    if (action === "update-category") {
      values = {
        category: formData.get("category") as string,
        updated_at: "NOW()",
      };
      table = "Action";
    } else if (action === "update-delay") {
      values = { date: formData.get("date") as string, updated_at: "NOW()" };
      table = "Action";
    } else if (action === "update-action-stage") {
      values = {
        stage: formData.get("stage") as string,
        updated_at: "NOW()",
      };
      table = "Action";
    } else if (action === "update-campaign-stage") {
      values = {
        stage: formData.get("stage") as string,
        updated_at: "NOW()",
      };
      table = "Campaign";
    } else if (action === "update-date") {
      values = {
        date: formData.get("date") as string,
        updated_at: "NOW()",
      };
      table = "Action";
    } else if (action === "update-action") {
      values = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        account: formData.get("account") as string,
        category: formData.get("category") as string,
        stage: formData.get("stage") as string,
        date: formData.get("date") as string,
        responsible: formData.get("responsible") as string,
        updated_at: "NOW()",
        campaign:
          formData.get("campaign") !== ""
            ? (formData.get("campaign") as string)
            : null,
      };

      table = "Action";
    } else if (action === "update-person") {
      table = "Person";
      values = {
        name: formData.get("name") as string,
      };
    } else if (action === "update-account") {
      table = "Account";
      values = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        short: formData.get("short") as string,
        users: formData.getAll("users") as string[],
      };
    } else if (action === "update-campaign") {
      values = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        date_start: formData.get("date_start") as string,
        date_end: formData.get("date_end") as string,
        updated_at: "NOW()",
      };

      table = "Campaign";
    } else if (action === "update-action-restore") {
      const { data, error } = await supabase
        .from("Action")
        .update({ deleted: null })
        .eq("id", id)
        .select()
        .single();
      return { data, error };
    }

    const { data, error } = await supabase
      .from(table)
      .update(values)
      .eq("id", id)
      .select("*")
      .single();

    return {
      data: {
        ...data,
        reload: formData.get("reload") === "true" ? true : null,
      },
      error,
    };
  } else if (action.match(/delete-/)) {
    let table = "";
    const id = formData.get("id") as string;
    const { supabase } = getSupabase(request);

    if (action === "delete-action") {
      const { data, error } = await supabase
        .from("Action")
        .update({ deleted: "true" })
        .eq("id", id)
        .select()
        .single();
      return { data, error };
    } else if (action === "delete-action-trash") {
      table = "Action";
    } else if (action === "delete-celebration") {
      table = "Celebration";
    } else if (action === "delete-account") {
      const [
        { data: accountData, error: accountError },
        { data: actionData, error: actionError },
      ] = await Promise.all([
        supabase.from("Account").delete().eq("id", id),
        supabase.from("Action").delete().eq("account", id),
      ]);

      return {
        data: { accountData, actionData },
        error: { accountError, actionError },
      };
    } else if (action === "delete-campaign") {
      const { data, error } = await supabase
        .from("Campaign")
        .update({ deleted: "true" })
        .eq("id", id)
        .select()
        .single();
      return { data, error };
    } else if (action === "delete-campaign-trash") {
      table = "Campaign";
    } else if (action === "delete-person") {
      const { data, error } = await supabase
        .from("Person")
        .delete()
        .eq("id", id)
        .select()
        .single();

      return { data, error };
    }

    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  } else if (action.match(/duplicate-/)) {
    const id = formData.get("id") as string;
    const account = formData.get("account") as string;

    if (action === "duplicate-action") {
      const { data: old_action } = await supabase
        .from("Action")
        .select("*")
        .eq("id", id)
        .single();

      const new_action = {
        name: old_action?.name,
        description: old_action?.description,
        date: old_action?.date,
        category: old_action?.category,
        stage: old_action?.stage,
        account: account ? account : old_action?.account,
        campaign: old_action?.campaign,
        creator: old_action?.creator,
        responsible: old_action?.responsible,
      };

      const { data, error } = await supabase
        .from("Action")
        .insert(new_action)
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      return { data, error };
    }
  }

  return {
    error: { message: "No matched action" },
  };
};
