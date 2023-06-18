import dayjs from "dayjs";
import { getMonth, getWeek, getYear } from "./functions";
import { getSupabase } from "./supabase";
import { type AppLoadContext } from "@remix-run/cloudflare";

const SQL__GET__ACTION = `*, account:Account!inner(*), category:Category(*), stage:Stage(*), campaign:Campaign(*), creator:Person!Action_creator_fkey(*), responsible:Person!Action_responsible_fkey(*) order by date, responsibles`;

const SQL__GET__ACTION_ONLY_ID = `date, Account!inner(slug)`;

// Simplificar para apenas dois
export const getPerson = (
  id: string,
  request: Request,
  context: AppLoadContext
) => {
  const { supabase } = getSupabase(request, context);
  return supabase.from("Person").select("*").eq("id", id).single();
};

export const getPersonByUser = (
  id: string,
  request: Request,
  context: AppLoadContext
) => {
  const { supabase } = getSupabase(request, context);
  const data = supabase.from("Person").select("*").eq("user_id", id).single();

  return data;
};

export const getPersons = (request: Request, context: AppLoadContext) => {
  const { supabase } = getSupabase(request, context);
  return supabase.from("Person").select("*").order("name", { ascending: true });
};

// Simplificar para 2

export const getAccount = async (
  request: Request,
  context: AppLoadContext,
  slug?: string,
  id?: string
) => {
  const { supabase } = getSupabase(request, context);
  if (id) {
    return supabase.from("Account").select("*").eq("id", id).single();
  }
  return supabase.from("Account").select("*").eq("slug", slug).single();
};

export const getAccounts = (
  userId: string,
  request: Request,
  context: AppLoadContext
) => {
  const { supabase } = getSupabase(request, context);
  return supabase
    .from("Account")
    .select("*")
    .contains("users", [userId])
    .order("name", {
      ascending: true,
    });
};

export const getAllAccounts = (request: Request, context: AppLoadContext) => {
  const { supabase } = getSupabase(request, context);
  return supabase.from("Account").select("*").order("name", {
    ascending: true,
  });
};

export const getCategoriesStagesAttributes = async (
  request: Request,
  context: AppLoadContext
) => {
  const { supabase } = getSupabase(request, context);
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
    context?: AppLoadContext;
    user?: string;
    account?: string;
    period?: string | null;
    mode?: "year" | "week" | "day" | "month";
    all?: boolean;
    where?: string;
  } = {}
) => {
  let { user, account, period, request, context, all, where, mode } = args;

  if (!request || !context) {
    return { error: { message: "Deu erro aqui" } };
  }

  const { supabase } = getSupabase(request, context);

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

export const getAction = async (
  request: Request,
  context: AppLoadContext,
  id: string
) => {
  const { supabase } = getSupabase(request, context);
  const { data, error } = await supabase
    .from("Action")
    .select(SQL__GET__ACTION)
    .eq("id", id)
    .single();

  return { data, error };
};

export const getCelebrations = async (
  request: Request,
  context: AppLoadContext
) => {
  const { supabase } = getSupabase(request, context);

  return supabase.from("Celebration").select("*").order("is_holiday");
};

export const getCampaign = async (
  request: Request,
  context: AppLoadContext,
  id: string
) => {
  const { supabase } = getSupabase(request, context);
  const { data, error } = await supabase
    .from("Campaign")
    .select(
      "*, Action!inner(*), Account!Campaign_account_fkey!inner(*), Stage:Stage!Campaign_stage_fkey!inner(*)"
    )
    .eq("id", id)
    .single();

  return { data, error };
};

export const getCampaigns = async (
  request: Request,
  context: AppLoadContext,
  user: string,
  account?: string
) => {
  const { supabase } = getSupabase(request, context);

  // TODO:
  // Filtrar campanhas pelas contas que o usuário tem acesso
  if (account) {
    const { data, error } = await supabase
      .from("Campaign")
      .select(
        "*, Account!Campaign_account_fkey!inner(*),Stage:Campaign_stage_fkey(*)"
      )

      .eq("Account.slug", account)
      .is("deleted", null)
      .order("date_start", {
        ascending: true,
      });

    return { data, error };
  } else {
    const { data, error } = await supabase
      .from("Campaign")
      .select(
        "*, Account!Campaign_account_fkey!inner(*), Stage:Campaign_stage_fkey(*)"
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

async function createCelebration(
  formData: FormData,
  request: Request,
  context: AppLoadContext
) {
  const { supabase } = getSupabase(request, context);

  let name = formData.get("name") as string;
  let date = formData.get("date") as string;
  if (name === "" || date === "") {
    return {
      error: {
        message: "'Nome' ou 'Data' está em branco",
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

export const handleAction = async (
  formData: FormData,
  request: Request,
  context: AppLoadContext
) => {
  const action = formData.get("action") as string;
  if (!action) throw new Error("O campo 'action' não foi definido.");

  const { supabase } = getSupabase(request, context);

  if (action.match(/create-/)) {
    // Celebration
    if (action === "create-celebration") {
      return await createCelebration(formData, request, context);
    } else if (action === "create-action") {
      const creator = formData.get("creator");
      const name = formData.get("name");
      const account = formData.get("account");
      const campaign = formData.get("campaign");
      const description = formData.get("description");
      const category = formData.get("category");
      const stage = formData.get("stage");
      const date = formData.get("date");
      const responsibles = formData.getAll("responsibles");

      const values = {
        creator: creator,
        responsibles,
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
    } else if (action === "update-action-name") {
      values = {
        name: formData.get("name") as string,
        updated_at: "NOW()",
      };

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
        responsibles: formData.getAll("responsibles") as string[],
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
        config_view: formData.get("config_view") as string,
        config_order: formData.get("config_order") as string,
        config_show: formData.get("config_show") as string,
        config_sidebar: formData.get("config_sidebar") as string,
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
    const { supabase } = getSupabase(request, context);

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
      const actionsDeleted = await supabase
        .from("Action")
        .delete()
        .eq("account", id);

      const accountDeleted = await supabase
        .from("Account")
        .delete()
        .eq("id", id);

      return {
        data: { account: accountDeleted.data, action: actionsDeleted.data },
        error: { account: accountDeleted.error, action: actionsDeleted.error },
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
