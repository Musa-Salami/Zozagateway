"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

export function SearchBar({ onClose, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.data ?? data);
          setIsOpen(true);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search snacks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9 h-9"
          aria-label="Search products"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-background shadow-lg">
          <ul className="py-1">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                    onClose?.();
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    {product.images?.[0]?.url && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.category?.name}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-brand-500 shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/menu?search=${encodeURIComponent(query)}`}
            onClick={() => {
              setIsOpen(false);
              setQuery("");
              onClose?.();
            }}
            className="block border-t px-3 py-2 text-center text-sm text-brand-500 hover:bg-muted transition-colors"
          >
            View all results
          </Link>
        </div>
      )}

      {isOpen && !isLoading && results.length === 0 && debouncedQuery.trim() && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-background p-4 text-center shadow-lg">
          <p className="text-sm text-muted-foreground">
            No products found for &ldquo;{debouncedQuery}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
