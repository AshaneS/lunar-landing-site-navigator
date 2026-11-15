import * as React from "react";
import {
  LayoutDashboard,
  Columns2,
  CalendarDays,

  Bookmark,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// 1. Simplified Navigation Data
const data = {
  navMain: [
    {
      title: "Workspace",
      items: [
        {
          title: "Explore South Pole",
          url: "/",
          icon: LayoutDashboard,
          isActive: true,
        },
        { title: "Compare Sites", url: "/compare-sites", icon: Columns2 },

        { title: "Compare Dates", url: "/compare-dates", icon: CalendarDays },
      ],
    },
    // {
    //   title: "Site Library",
    //   items: [
    //     { title: "A3 Candidate Regions", url: "#", icon: Map },
    //     { title: "Custom Coordinates", url: "#", icon: Map },
    //   ],
    // },
    {
      title: "LIBRARY",
      items: [{ title: "Saved Library", url: "/library", icon: Bookmark }],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      {/* 2. Simple Header instead of Version Switcher */}
      <SidebarHeader className="flex items-center py-4 border-b border-sidebar-border">
        <Link href={`/`} className="text-xl font-bold tracking-tight">
          Lunar Dashboard
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.isActive}>
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Keeps the little drag handle on the edge */}
      <SidebarRail />
    </Sidebar>
  );
}
