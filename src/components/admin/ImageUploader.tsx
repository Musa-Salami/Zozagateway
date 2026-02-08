"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  ChevronUp,
  ChevronDown,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_UPLOAD_IMAGES } from "@/lib/constants";
import type { ProductImage } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ImageUploaderProps {
  images: ProductImage[];
  onUpload: (files: File[]) => void | Promise<void>;
  onRemove: (imageId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function ImageUploader({
  images,
  onUpload,
  onRemove,
  onReorder,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canUpload = images.length < MAX_UPLOAD_IMAGES;

  const validateFiles = (files: FileList | File[]): File[] => {
    const fileArray = Array.from(files);
    const valid = fileArray.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) return false;
      if (file.size > 5 * 1024 * 1024) return false; // 5MB max
      return true;
    });
    const remaining = MAX_UPLOAD_IMAGES - images.length;
    return valid.slice(0, remaining);
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const validFiles = validateFiles(files);
      if (validFiles.length === 0) return;

      setUploadProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      await onUpload(validFiles);

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 500);
      clearInterval(interval);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images.length, onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!canUpload) return;
      handleFiles(e.dataTransfer.files);
    },
    [canUpload, handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {canUpload && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragging
              ? "border-brand-500 bg-brand-500/5"
              : "border-muted-foreground/25 hover:border-brand-500/50 hover:bg-muted/50"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              isDragging ? "bg-brand-500/10" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-6 w-6",
                isDragging ? "text-brand-500" : "text-muted-foreground"
              )}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              <span className="text-brand-500">Click to browse</span> or drag
              and drop
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG or WebP (max 5MB each)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Image Count Indicator */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {images.length} of {MAX_UPLOAD_IMAGES} images
        </p>
        {!canUpload && (
          <p className="text-xs font-medium text-amber-600">
            Maximum images reached
          </p>
        )}
      </div>

      {/* Image Previews */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7"
                      disabled={index === 0}
                      onClick={() => onReorder(index, index - 1)}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7"
                      disabled={index === images.length - 1}
                      onClick={() => onReorder(index, index + 1)}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemove(image.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* Position Label */}
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Main
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
