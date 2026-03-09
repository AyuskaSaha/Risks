"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Fingerprint,
  Zap,
  Bot,
  MessageSquareText,
  BadgeAlert,
  Scale,
  Globe
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Risk Copilot", url: "/copilot", icon: MessageSquareText },
];

const riskCategories = [
  { title: "Financial", url: "/risk/financial", icon: TrendingUp },
  { title: "Cybersecurity", url: "/risk/cybersecurity", icon: Fingerprint },
  { title: "Operational", url: "/risk/operational", icon: Zap },
  { title: "Compliance", url: "/risk/compliance", icon: Scale },
  { title: "Strategic", url: "/risk/strategicMarket", icon: Globe },
];

const agents = [
  { title: "Financial Agent", url: "/agents/Financial", icon: Bot },
  { title: "Cyber Agent", url: "/agents/Cybersecurity", icon: Bot },
  { title: "Ops Agent", url: "/agents/Operational", icon: Bot },
  { title: "Compliance Agent", url: "/agents/Compliance", icon: Bot },
  { title: "Strategic Agent", url: "/agents/StrategicMarket", icon: Bot },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <ShieldAlert className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-white font-headline">
            Intelli<span className="text-primary">Risk</span>
          </span>
        </Link>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
          <ShieldAlert className="w-8 h-8 text-primary" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/50">Risk Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {riskCategories.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/50">Agent Debug</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {agents.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-sidebar-accent/50 group-data-[collapsible=icon]:hidden">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-sidebar-foreground">System Status</span>
            <span className="text-[10px] text-primary">All Agents Active</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
