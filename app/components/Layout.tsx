import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Link,
  useMatches,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowBigUp,
  Briefcase,
  ChevronRight,
  CommandIcon,
  Plus,
  Search,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { fade, scaleUp } from "~/lib/animations";
import { SHORTCUTS } from "~/lib/constants";
import type {
  AccountModel,
  ContextType,
  PersonModel,
  ShortcutModel,
} from "~/lib/models";
import Button from "./Button";
import ActionDialog from "./Dialogs/ActionDialog";
import CampaignDialog from "./Dialogs/CampaignDialog";
import CelebrationDialog from "./Dialogs/CelebrationDialog";
import SearchDialog from "./Dialogs/SearchDialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const { slug } = useParams();

  const person: PersonModel = matches[1].data.person;
  const accounts: AccountModel[] = matches[1].data.accounts;
  const context: ContextType = useOutletContext();

  const [shortcut, setShorcut] = useState<ShortcutModel>();
  const [scrollTo, setScrollTo] = useState(0);
  const [openAccountsMenu, setOpenAccountsMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const searchParams =
    params.get("month") !== null ? `?month=${params.get("month")}` : "";

  useEffect(() => {
    document.addEventListener("scroll", (event) => {
      setScrollTo(window.scrollY);
    });

    function handleShortcut(shortcut: ShortcutModel) {
      setShorcut(shortcut);
      setTimeout(() => {
        setShorcut(undefined);
      }, 2000);
    }

    function keyDown(event: KeyboardEvent) {
      // SHORTCUTS

      if (event.key) {
        const key = event.key.toUpperCase();

        if (event.metaKey && !event.shiftKey && key == "K") {
          event.preventDefault();
          context.search.set((prev) => !prev);
          handleShortcut(SHORTCUTS.SEARCH);
        } else if (
          event.metaKey &&
          event.shiftKey &&
          !["SHIFT", "META", "ALT"].includes(key) &&
          !["TEXTAREA", "INPUT"].includes((event.target as HTMLElement).tagName)
        ) {
          if (key === SHORTCUTS.SHORTCUTS.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.SHORTCUTS);
            context.shortcut.set((prev) => !prev);
          } else if (key === SHORTCUTS.NEW_ACTION.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.NEW_ACTION);
            context.actions.set((prev) => !prev);
          } else if (key === SHORTCUTS.NEW_CELEBRATION.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.NEW_CELEBRATION);
            context.celebrations.set((prev) => !prev);
          } else if (key === SHORTCUTS.NEW_CAMPAIGN.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.NEW_CAMPAIGN);
            context.campaigns.set((prev) => !prev);
          } else if (key === SHORTCUTS.SIDEBAR.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.SIDEBAR);
            context.sidebar.set((prev) => !prev);
          } else if (key === SHORTCUTS.PRIORITY.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.PRIORITY);
            context.priority.set((value) => !value);
          } else if (key === SHORTCUTS.ARRANGE_ALL.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.ARRANGE_ALL);
            context.arrange.set(SHORTCUTS.ARRANGE_ALL.value);
          } else if (key === SHORTCUTS.ARRANGE_CATEGORIES.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.ARRANGE_CATEGORIES);
            context.arrange.set(SHORTCUTS.ARRANGE_CATEGORIES.value);
          } else if (key === SHORTCUTS.ARRANGE_ACCOUNTS.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.ARRANGE_ACCOUNTS);
            context.arrange.set(SHORTCUTS.ARRANGE_ACCOUNTS.value);
          } else if (key === SHORTCUTS.FILTER_ALL.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_ALL);
            context.filter.set(SHORTCUTS.FILTER_ALL.value);
          } else if (key === SHORTCUTS.FILTER_FEED.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_FEED);
            context.filter.set(SHORTCUTS.FILTER_FEED.value);
          } else if (key === SHORTCUTS.FILTER_REELS.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_REELS);
            context.filter.set(SHORTCUTS.FILTER_REELS.value);
          } else if (key === SHORTCUTS.FILTER_TASK.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_TASK);
            context.filter.set(SHORTCUTS.FILTER_TASK.value);
          } else if (key === SHORTCUTS.FILTER_STORIES.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_STORIES);
            context.filter.set(SHORTCUTS.FILTER_STORIES.value);
          } else if (key === SHORTCUTS.FILTER_MEETING.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_MEETING);
            context.filter.set(SHORTCUTS.FILTER_MEETING.value);
          } else if (key === SHORTCUTS.FILTER_PRINT.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_PRINT);
            context.filter.set(SHORTCUTS.FILTER_PRINT.value);
          } else if (key === SHORTCUTS.FILTER_TIKTOK.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_TIKTOK);
            context.filter.set(SHORTCUTS.FILTER_TIKTOK.value);
          } else if (key === SHORTCUTS.FILTER_FINANCIAL.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_FINANCIAL);
            context.filter.set(SHORTCUTS.FILTER_FINANCIAL.value);
          } else if (key === SHORTCUTS.FILTER_DEVELOPMENT.shortcut) {
            event.preventDefault();
            handleShortcut(SHORTCUTS.FILTER_DEVELOPMENT);
            context.filter.set(SHORTCUTS.FILTER_DEVELOPMENT.value);
          }
        }
      }
    }

    window.addEventListener("keydown", keyDown);

    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, [context]);

  const shortcuts: Array<{
    title: string;
    shortcuts: Array<{ shortcut: string; does: string; value?: string }>;
  }> = [
    {
      title: "Ações",
      shortcuts: [
        { ...SHORTCUTS.SEARCH },
        { ...SHORTCUTS.SHORTCUTS },
        { ...SHORTCUTS.NEW_ACTION },
        { ...SHORTCUTS.NEW_CELEBRATION },
        { ...SHORTCUTS.NEW_CAMPAIGN },
        { ...SHORTCUTS.SIDEBAR },
        { ...SHORTCUTS.PRIORITY },
      ],
    },
    {
      title: "Filtros",
      shortcuts: [
        { ...SHORTCUTS.ARRANGE_ALL },
        { ...SHORTCUTS.ARRANGE_CATEGORIES },
        { ...SHORTCUTS.ARRANGE_ACCOUNTS },
        { ...SHORTCUTS.FILTER_ALL },
        { ...SHORTCUTS.FILTER_FEED },
        { ...SHORTCUTS.FILTER_REELS },
        { ...SHORTCUTS.FILTER_TASK },
        { ...SHORTCUTS.FILTER_STORIES },
        { ...SHORTCUTS.FILTER_MEETING },
        { ...SHORTCUTS.FILTER_PRINT },
        { ...SHORTCUTS.FILTER_TIKTOK },
        { ...SHORTCUTS.FILTER_FINANCIAL },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-full flex-col lg:flex-row">
      {/* Header */}
      <div
        className={`no-scrollbars fixed z-30 flex h-12 w-full flex-shrink-0 items-center justify-between border-b border-transparent transition-colors lg:relative lg:flex lg:h-screen lg:flex-col lg:overflow-hidden lg:overflow-y-auto lg:py-4 ${
          context.sidebar.open ? "lg:w-48" : "lg:w-16"
        } ${
          scrollTo > 10
            ? "border-gray-500/50 bg-gray-800/50 backdrop-blur-xl"
            : ""
        }`}
      >
        <div className="lg:w-full">
          {/* Logo */}
          <div className={`-mt-1 max-w-[8rem] p-2 lg:pt-0`}>
            <Link
              to="/dashboard"
              className=" block rounded p-2 outline-none focus:ring-2 focus:ring-brand"
            >
              {context.sidebar.open ? (
                <>
                  <img src="/logo.png" alt="ZTUDIO" />
                </>
              ) : (
                <img src="/ico.png" className="mx-auto h-6" alt="ZTUDIO" />
              )}
            </Link>
            {person.admin && (
              <div className="ml-2 font-mono text-xx font-bold opacity-30">
                version 2357.1813
              </div>
            )}
          </div>
          {/* Clientes large view */}
          <div className="hidden space-y-1 p-2 lg:block">
            {accounts.map((account) => (
              <div key={account.id}>
                <Link
                  to={`/dashboard/${account.slug}/${searchParams}`}
                  className={`${
                    context.sidebar.open
                      ? "overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold "
                      : "text-center text-xx font-bold uppercase"
                  } block rounded-lg p-2  focus:outline-none focus:ring-2 focus:ring-brand ${
                    slug === account.slug
                      ? "bg-brand text-white ring-offset-2 ring-offset-white dark:ring-offset-gray-950"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {context.sidebar.open ? account.name : account.short}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center pr-2 lg:flex lg:w-full lg:flex-col lg:p-2">
          {/* Clientes mobile */}
          <div className="lg:hidden">
            <DropdownMenu.Root
              open={openAccountsMenu}
              onOpenChange={setOpenAccountsMenu}
            >
              <DropdownMenu.Trigger asChild>
                <button className="p-2">
                  <Briefcase className="sq-4" />
                </button>
              </DropdownMenu.Trigger>
              <AnimatePresence>
                {openAccountsMenu && (
                  <DropdownMenu.Portal forceMount>
                    <DropdownMenu.Content
                      className="dropdown-content mr-2 origin-top"
                      forceMount
                      asChild
                    >
                      <motion.div {...scaleUp(0.3)}>
                        {accounts.map((account) => (
                          <DropdownMenu.Item key={account.id} asChild>
                            <Link
                              to={`/dashboard/${account.slug}/${searchParams}`}
                              className="dropdown-item item-small"
                            >
                              {account.name}
                            </Link>
                          </DropdownMenu.Item>
                        ))}
                      </motion.div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                )}
              </AnimatePresence>
            </DropdownMenu.Root>
          </div>

          {/* Search */}
          <div className="w-full lg:p-2">
            <button
              onClick={() => {
                context.search.set(true);
              }}
              className=" flex w-full cursor-text items-center gap-2 rounded-lg px-3 py-2 outline-none lg:bg-gray-100 lg:dark:bg-gray-800"
            >
              {context.sidebar.open && (
                <div className="hidden items-center gap-2 text-xs font-medium text-gray-400 lg:flex">
                  <div>Pesquisar</div>
                </div>
              )}
              <div className={`${context.sidebar.open ? "ml-auto" : "-ml-1"}`}>
                <Search className="sq-4" />
              </div>
            </button>
          </div>

          {/* User Menu */}
          <div>
            <DropdownMenu.Root
              open={openUserMenu}
              onOpenChange={setOpenUserMenu}
            >
              <DropdownMenu.Trigger className="flex items-center gap-2 rounded p-2 outline-none lg:w-full">
                {context.sidebar.open && (
                  <div className="hidden text-xs font-semibold lg:block">
                    {person.name}
                  </div>
                )}

                <User
                  className={`${context.sidebar.open ? "ml-auto" : "ml-2"} w-4`}
                />
              </DropdownMenu.Trigger>
              <AnimatePresence>
                {openUserMenu && (
                  <DropdownMenu.Portal forceMount>
                    <DropdownMenu.Content loop forceMount asChild>
                      <motion.div
                        {...scaleUp(0.3)}
                        className="dropdown-content mr-4 origin-bottom"
                      >
                        {/* Theme Switcher */}
                        {/* <div className="flex items-center justify-between gap-2">

                        </div>

                        <hr className="dropdown-hr" /> */}
                        {/* Minha Conta */}
                        <DropdownMenu.Label className="dropdown-label">
                          minha conta
                        </DropdownMenu.Label>
                        {/* Meus Dados */}
                        <DropdownMenu.Item asChild>
                          <Link
                            to="/dashboard/me"
                            className="dropdown-item item-small"
                          >
                            Meus dados
                          </Link>
                        </DropdownMenu.Item>
                        {/* Lixeira */}
                        <DropdownMenu.Item asChild>
                          <Link
                            to="/dashboard/trash"
                            className="dropdown-item item-small"
                          >
                            Lixeira
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="dropdown-item item-small"
                          onSelect={() => context.shortcut.set(true)}
                        >
                          Ajuda
                        </DropdownMenu.Item>
                        {/* Sair */}
                        <DropdownMenu.Item
                          className="dropdown-item item-small"
                          onSelect={async () => {
                            const { error } =
                              await context.supabase.auth.signOut();
                            if (!error) {
                              navigate("/login");
                            }
                          }}
                        >
                          Sair
                        </DropdownMenu.Item>

                        {/* Admin */}
                        {person.admin && (
                          <>
                            <hr className="dropdown-hr" />
                            <DropdownMenu.Label className="dropdown-label">
                              admin
                            </DropdownMenu.Label>
                            {/* Clientes / Accounts  */}
                            <DropdownMenu.Sub>
                              <DropdownMenu.SubTrigger className="dropdown-item item-small">
                                <div className="flex items-center">
                                  <div>Clientes</div>
                                  <ChevronRight className="ml-auto h-4 w-4" />
                                </div>
                              </DropdownMenu.SubTrigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.SubContent className="dropdown-content">
                                  <DropdownMenu.Item asChild>
                                    <Link
                                      to={`/dashboard/admin/accounts`}
                                      className="dropdown-item item-small"
                                    >
                                      Ver Clientes
                                    </Link>
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Item asChild>
                                    <Link
                                      to={`/dashboard/admin/accounts/new`}
                                      className="dropdown-item item-small"
                                    >
                                      Novo Cliente
                                    </Link>
                                  </DropdownMenu.Item>
                                </DropdownMenu.SubContent>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Sub>
                            {/* Usuários */}
                            <DropdownMenu.Sub>
                              <DropdownMenu.SubTrigger className="dropdown-item item-small">
                                <div className="flex items-center">
                                  <div>Usuários</div>
                                  <ChevronRight className="ml-auto h-4 w-4" />
                                </div>
                              </DropdownMenu.SubTrigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.SubContent className="dropdown-content">
                                  <DropdownMenu.Item asChild>
                                    <Link
                                      to={`/dashboard/admin/users/`}
                                      className="dropdown-item item-small"
                                    >
                                      Ver Usuários
                                    </Link>
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Item asChild>
                                    <Link
                                      to={`/dashboard/admin/users/new`}
                                      className="dropdown-item item-small"
                                    >
                                      Novo Usuário
                                    </Link>
                                  </DropdownMenu.Item>
                                </DropdownMenu.SubContent>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Sub>

                            <hr className="dropdown-hr" />
                            {/* Roadmap */}
                            <DropdownMenu.Item asChild>
                              <Link
                                to={`/roadmap`}
                                className="dropdown-item item-small"
                              >
                                Roadmap
                              </Link>
                            </DropdownMenu.Item>
                          </>
                        )}
                      </motion.div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                )}
              </AnimatePresence>
            </DropdownMenu.Root>
          </div>
          {/* Create Action on Mobile */}
          <div className="ml-2 lg:hidden">
            <Button
              primary
              className="p-2 text-sm sm:p-1.5 sm:px-4"
              onClick={() => context.actions.set(true)}
            >
              <span className="hidden sm:block">Nova Ação</span>
              <Plus />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-12 w-full lg:mt-0 lg:px-4">{children}</div>
      {/* Shortcut */}
      <Dialog.Root
        open={context.shortcut.open}
        onOpenChange={context.shortcut.set}
      >
        <AnimatePresence>
          {context.shortcut.open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay forceMount asChild>
                <motion.div className="dialog-overlay" {...fade()}></motion.div>
              </Dialog.Overlay>
              <Dialog.Content forceMount className="dialog">
                <motion.div
                  className="rounded-xl p-4 font-light antialiased md:p-8"
                  {...scaleUp()}
                >
                  <div className="mb-4 text-2xl font-medium">Atalhos</div>
                  <div className="grid-cols-2 gap-8 md:grid">
                    {shortcuts.map((column, index) => (
                      <div key={index} className=" text-xs">
                        <div className="mb-2 text-xs font-bold uppercase">
                          {column.title}
                        </div>
                        {column.shortcuts.map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-4 py-1"
                          >
                            <div className="flex items-center gap-1 font-bold">
                              <div>
                                <CommandIcon className="sq-3 w-3" />
                              </div>
                              {shortcut.value !== "search" && (
                                <>
                                  <div>+</div>
                                  <div className="text-xx">
                                    <ArrowBigUp className="sq-3 w-3" />
                                  </div>
                                </>
                              )}
                              <div>+</div>
                              <div>{shortcut.shortcut}</div>
                            </div>
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-right">
                              {shortcut.does}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      <>
        {/* Dialog for Celebration */}
        <Dialog.Root
          open={context.celebrations.open}
          onOpenChange={(v: boolean) => {
            context.celebrations.set(v);
          }}
        >
          <AnimatePresence>
            {context.celebrations.open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased "
                    {...scaleUp()}
                  >
                    <CelebrationDialog />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
        {/* Dialog for Actions */}
        <Dialog.Root
          open={context.actions.open}
          onOpenChange={context.actions.set}
        >
          <AnimatePresence>
            {context.actions.open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased "
                    {...scaleUp()}
                  >
                    <ActionDialog />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
        {/* Dialog for Campaign */}
        <Dialog.Root
          open={context.campaigns.open}
          onOpenChange={context.campaigns.set}
        >
          <AnimatePresence>
            {context.campaigns.open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog">
                  <motion.div
                    className="dialog-content no-scrollbars max-h-[90vh] w-[90vw] max-w-lg overflow-hidden overflow-y-auto p-8 font-light antialiased "
                    {...scaleUp()}
                  >
                    <CampaignDialog />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
        {/* Dialog for Search */}
        <Dialog.Root
          open={context.search.open}
          onOpenChange={context.search.set}
        >
          <AnimatePresence>
            {context.search.open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="dialog-overlay"
                    {...fade()}
                  ></motion.div>
                </Dialog.Overlay>

                <Dialog.Content forceMount className="dialog dialog-search">
                  <motion.div
                    className="dialog-content w-[36rem] max-w-lg font-light antialiased"
                    {...scaleUp()}
                  >
                    <SearchDialog />
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
        {/* Dialog for Shortcut */}

        <AnimatePresence>
          {shortcut !== undefined && (
            <motion.div
              className="dialog-toast rounded-b-2xl p-4 antialiased backdrop-blur-md"
              {...fade(0.1)}
            >
              <div className="mb-1 flex items-center justify-center gap-1 text-xl font-bold ">
                <div>
                  <CommandIcon className="h-6 w-6" />
                </div>
                {shortcut.value !== "search" && (
                  <>
                    <div>+</div>
                    <div>
                      <ArrowBigUp className="h-6 w-6" />
                    </div>
                  </>
                )}
                <div>+</div>
                <div>{shortcut.shortcut}</div>
              </div>
              <div className="text-center text-xx font-medium uppercase tracking-wider">
                {shortcut.does}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </div>
  );
}
