import { redirect } from "@remix-run/cloudflare";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type {
  AccountModel,
  ActionModel,
  ItemModel,
  PeriodType,
} from "~/lib/models";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Fortaleza");

export const getWeek = ({ period }: { period?: string | null }) => {
  const day = dayjs(period ?? new Date());

  const firstDayOfWeek = day.startOf("week");
  const lastDayOfWeek = day.endOf("week");
  const days: PeriodType = [];
  const diffDays = lastDayOfWeek.diff(firstDayOfWeek, "days") + 1;

  for (let index = 0; index < diffDays; index++) {
    let currentDate = firstDayOfWeek.add(index, "day");
    days.push({ date: currentDate });
  }

  return {
    firstDayOfPeriod: firstDayOfWeek,
    lastDayOfPeriod: lastDayOfWeek,
    firstDayOfWeek,
    lastDayOfWeek,
    days,
  };
};

export const getMonth = ({ period }: { period?: string | null }) => {
  const day = dayjs(period ?? new Date());

  const firstDayOfCurrentMonth = day.startOf("month");
  const lastDayOfCurrentMonth = day.endOf("month");
  const firstDayOfPeriod = firstDayOfCurrentMonth.startOf("week");
  const lastDayOfPeriod = lastDayOfCurrentMonth.endOf("week");
  const days: Array<Dayjs> = [];
  const _period: PeriodType = [];
  const diffDays = lastDayOfPeriod.diff(firstDayOfPeriod, "days") + 1;

  for (let index = 0; index < diffDays; index++) {
    let currentDate = firstDayOfPeriod.add(index, "day");
    days.push(currentDate);
    _period.push({ date: currentDate });
  }

  return {
    firstDayOfCurrentMonth,
    lastDayOfCurrentMonth,
    firstDayOfPeriod,
    lastDayOfPeriod,
    days,
    period: _period,
  };
};

export const getYear = ({ period }: { period?: string | null }) => {
  const day = dayjs(period ?? new Date());

  const firstDayOfCurrentYear = day.startOf("year");
  const lastDayOfCurrentYear = day.endOf("year");
  const firstDayOfPeriod = firstDayOfCurrentYear.startOf("week");
  const lastDayOfPeriod = lastDayOfCurrentYear.endOf("week");

  const year: Array<PeriodType> = [];

  function getDaysOnMonth(month: number) {
    const Month = dayjs().month(month);
    const First = Month.startOf("month");
    const Last = Month.endOf("month");
    return Last.diff(First, "days") + 1;
  }

  for (let month = 0; month < 12; month++) {
    let current = firstDayOfCurrentYear.add(month, "month").clone();
    const Month: PeriodType = [];
    for (let day = 0; day < getDaysOnMonth(month); day++) {
      Month.push({ date: current.add(day, "day") });
    }
    year.push(Month);
  }

  return { firstDayOfCurrentYear, firstDayOfPeriod, lastDayOfPeriod, year };
};

export const isToday = (date: Dayjs | string) => {
  return dayjs().format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD");
};

export function actionsByPriority(actions: ActionModel[]) {
  // return actions;
  return actions
    .reverse()
    .sort((a, b) =>
      (a.stage.priority as number) > (b.stage.priority as number) ? 1 : -1
    );
}

export function actionsByCategory(
  actions: ActionModel[],
  categories: ItemModel[],
  priority?: boolean
) {
  const actionsByCategory = categories.map((currentCategory, index) => {
    let category: { category: ItemModel; actions: ActionModel[] } = {
      category: currentCategory,
      actions: [],
    };

    let _actions = priority
      ? actionsByPriority(
          actions.filter(
            (action) => action.category.slug === currentCategory.slug
          )
        )
      : actions.filter(
          (action) => action.category.slug === currentCategory.slug
        );

    category.actions = _actions;

    return category;
  });

  return actionsByCategory;
}

export function actionsByAccount(
  actions: ActionModel[],
  accounts: AccountModel[],
  priority?: boolean
) {
  const _accounts = accounts.map((_account) => {
    let accountGroup: { account: AccountModel; actions: ActionModel[] } = {
      account: _account,
      actions: [],
    };
    let _actions = priority
      ? actionsByPriority(
          actions.filter((action) => action.account.id === _account.id)
        )
      : actions.filter((action) => action.account.id === _account.id);
    accountGroup.actions = _actions;
    return accountGroup;
  });
  return _accounts;
}

export function shortWord(word: string) {
  return `${word[0]}${word
    .substring(1)
    .toLowerCase()
    .replace(/[aãáeéêiíoóãôuú]/g, "")}`;
}

export function checkDate(
  date: string | null = dayjs().format("DD-MM-YYYY"),
  redirectTo: string = ""
) {
  const pattern = /^\d{1,2}-\d{1,2}-\d{4}$/;

  let day = dayjs().tz("America/Fortaleza");

  if (date?.match(pattern)) {
    let splitDate = date.split("-");
    day = dayjs(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`);
    if (!day.isValid()) {
      throw redirect(
        `${redirectTo}?date=${dayjs().format("DD-MM-YYYY")}&invalidDate=${date}`
      );
    } else {
      return day.format("YYYY-MM-DD");
    }
  }

  return day.format("YYYY-MM-DD");
}
