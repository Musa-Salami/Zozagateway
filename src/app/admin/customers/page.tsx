"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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

// ── Demo Data ──────────────────────────────────────────────────────────────

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
}

const demoCustomers: Customer[] = [
  { id: "u1", name: "John Adeyemi", email: "john@example.com", phone: "+2348012345678", avatar: null, ordersCount: 12, totalSpent: 342.5, joinedAt: "2025-06-15T10:00:00Z" },
  { id: "u2", name: "Amina Bello", email: "amina@example.com", phone: "+2348023456789", avatar: null, ordersCount: 8, totalSpent: 256.0, joinedAt: "2025-07-20T08:00:00Z" },
  { id: "u3", name: "Chidi Okonkwo", email: "chidi@example.com", phone: "+2348034567890", avatar: null, ordersCount: 15, totalSpent: 487.25, joinedAt: "2025-05-10T14:00:00Z" },
  { id: "u4", name: "Fatima Hassan", email: "fatima@example.com", phone: "+2348045678901", avatar: null, ordersCount: 6, totalSpent: 178.0, joinedAt: "2025-08-05T12:00:00Z" },
  { id: "u5", name: "Emeka Nwosu", email: "emeka@example.com", phone: "+2348056789012", avatar: null, ordersCount: 20, totalSpent: 612.75, joinedAt: "2025-04-01T09:00:00Z" },
  { id: "u6", name: "Ngozi Eze", email: "ngozi@example.com", phone: "+2348067890123", avatar: null, ordersCount: 3, totalSpent: 89.5, joinedAt: "2025-10-12T16:00:00Z" },
  { id: "u7", name: "Bola Akinwale", email: "bola@example.com", phone: "+2348078901234", avatar: null, ordersCount: 9, totalSpent: 295.0, joinedAt: "2025-07-01T11:00:00Z" },
  { id: "u8", name: "Kemi Oluwole", email: "kemi@example.com", phone: "+2348089012345", avatar: null, ordersCount: 11, totalSpent: 380.25, joinedAt: "2025-06-20T07:00:00Z" },
  { id: "u9", name: "Tunde Bakare", email: "tunde@example.com", phone: "+2348090123456", avatar: null, ordersCount: 7, totalSpent: 210.0, joinedAt: "2025-08-15T13:00:00Z" },
  { id: "u10", name: "Zainab Musa", email: "zainab@example.com", phone: "+2348001234567", avatar: null, ordersCount: 14, totalSpent: 445.5, joinedAt: "2025-05-25T15:00:00Z" },
  { id: "u11", name: "Ade Ogundimu", email: "ade@example.com", phone: "+2348011234567", avatar: null, ordersCount: 5, totalSpent: 155.0, joinedAt: "2025-09-10T10:00:00Z" },
  { id: "u12", name: "Halima Yusuf", email: "halima@example.com", phone: "+2348021234567", avatar: null, ordersCount: 18, totalSpent: 520.75, joinedAt: "2025-04-20T08:00:00Z" },
];

// ── Page Component ──────────────────────────────────────────────────────────

type SortField = "name" | "ordersCount" | "totalSpent" | "joinedAt";
type SortDir = "asc" | "desc";

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("joinedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

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
    let result = [...demoCustomers];

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
  }, [search, sortField, sortDir]);

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
          {demoCustomers.length} registered customers
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
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/customers/${customer.id}`)}
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
