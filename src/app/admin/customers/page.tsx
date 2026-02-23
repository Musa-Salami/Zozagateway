"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice, formatDate } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";
import { useOrderStore, type Customer } from "@/stores/orderStore";

// ── Page Component ──────────────────────────────────────────────────────────

type SortField = "name" | "ordersCount" | "totalSpent" | "joinedAt";
type SortDir = "asc" | "desc";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("joinedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const hasHydrated = useOrderStore((state) => state._hasHydrated);
  // Subscribe to orders so component re-renders when orders change
  const orders = useOrderStore((state) => state.orders);
  const getCustomers = useOrderStore((state) => state.getCustomers);
  const customers = getCustomers();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 h-3.5 w-3.5 text-brand-500" />
    ) : (
      <ChevronDown className="ml-1 h-3.5 w-3.5 text-brand-500" />
    );
  };

  const filtered = useMemo(() => {
    let result = [...customers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "ordersCount":
          cmp = a.ordersCount - b.ordersCount;
          break;
        case "totalSpent":
          cmp = a.totalSpent - b.totalSpent;
          break;
        case "joinedAt":
          cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [customers, search, sortField, sortDir]);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <Users className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No customers yet</h2>
        <p className="text-muted-foreground max-w-sm">
          Customer profiles are created automatically when orders are placed through the storefront.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">
          {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12" />
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                <span className="flex items-center">
                  Name <SortIcon field="name" />
                </span>
              </TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("ordersCount")}
              >
                <span className="flex items-center">
                  Orders <SortIcon field="ordersCount" />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("totalSpent")}
              >
                <span className="flex items-center">
                  Total Spent <SortIcon field="totalSpent" />
                </span>
              </TableHead>
              <TableHead
                className="hidden sm:table-cell cursor-pointer select-none"
                onClick={() => handleSort("joinedAt")}
              >
                <span className="flex items-center">
                  Joined <SortIcon field="joinedAt" />
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No customers found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      {customer.avatar && (
                        <AvatarImage src={customer.avatar} alt={customer.name} />
                      )}
                      <AvatarFallback className="bg-brand-500/10 text-brand-500 text-xs font-semibold">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {customer.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {customer.phone}
                  </TableCell>
                  <TableCell>{customer.ordersCount}</TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDate(customer.joinedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
