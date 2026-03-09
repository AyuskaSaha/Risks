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
  Globe,
  FileText
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
          <SidebarGroupLabel className="text-muted-foreground/40 text-[10px] uppercase font-bold tracking-wider">Analysis Vectors</SidebarGroupLabel>
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
          <SidebarGroupLabel className="text-muted-foreground/40 text-[10px] uppercase font-bold tracking-wider">Context Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-not-allowed opacity-60">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-xs">SRS.pdf</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-not-allowed opacity-60">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-xs">BRD_v2.pdf</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-not-allowed opacity-60">
                <Scale className="w-4 h-4 text-green-400" />
                <span className="text-xs">Policy_Legal.pdf</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10 group-data-[collapsible=icon]:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">System Engine</span>
            <span className="text-[10px] text-primary">Gemini 2.5 Active</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}