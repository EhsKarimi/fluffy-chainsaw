import { SharedTexts } from "@/shared/constants/SharedTexts";

export type PageTitleSearch = Record<string, unknown>;

type PageTitleLocation = {
  pathname: string;
  search: PageTitleSearch;
};

function getCustomerPageTitle(search: PageTitleSearch) {
  if (search.action === "new") {
    return SharedTexts.PageTitles.AddCustomer;
  }

  if (search.action === "edit") {
    return SharedTexts.PageTitles.EditCustomer;
  }

  return SharedTexts.PageTitles.Customers;
}

export function formatPageTitle(currentPageTitle: string) {
  return SharedTexts.PageTitle.Template.replace("{currentPageTitle}", currentPageTitle);
}

export function getPageTitle({ pathname, search }: PageTitleLocation) {
  if (pathname === "/login") {
    return SharedTexts.PageTitles.Login;
  }

  if (pathname === "/dashboard" || pathname === "/") {
    return SharedTexts.PageTitles.Dashboard;
  }

  if (pathname === "/crm/customers") {
    return getCustomerPageTitle(search);
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
