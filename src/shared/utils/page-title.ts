import { SharedTexts } from "@/shared/constants/SharedTexts";

export type PageTitleSearch = Record<string, unknown>;

type PageTitleLocation = {
  pathname: string;
  search: PageTitleSearch;
};

export function formatPageTitle(currentPageTitle: string) {
  return SharedTexts.PageTitle.Template.replace("{currentPageTitle}", currentPageTitle);
}

export function getPageTitle({ pathname }: PageTitleLocation) {
  if (pathname === "/login") {
    return SharedTexts.PageTitles.Login;
  }

  if (pathname === "/dashboard" || pathname === "/") {
    return SharedTexts.PageTitles.Dashboard;
  }

  if (pathname === "/crm/customers") {
    return SharedTexts.PageTitles.Customers;
  }

  if (pathname === "/crm/customers/new") {
    return SharedTexts.PageTitles.AddCustomer;
  }

  if (/^\/crm\/customers\/[^/]+\/edit$/.test(pathname)) {
    return SharedTexts.PageTitles.EditCustomer;
  }

  if (pathname === "/crm/projects") {
    return SharedTexts.PageTitles.Projects;
  }

  if (pathname === "/reports") {
    return SharedTexts.PageTitles.Reports;
  }

  if (pathname === "/settings/users") {
    return SharedTexts.PageTitles.Users;
  }

  if (pathname === "/settings/roles") {
    return SharedTexts.PageTitles.Roles;
  }

  if (pathname === "/profile") {
    return SharedTexts.PageTitles.Profile;
  }

  if (pathname === "/about") {
    return SharedTexts.PageTitles.About;
  }

  return SharedTexts.PageTitle.Suffix;
}
