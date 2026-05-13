"use client";

import { useState } from "react";
import { ImageIcon, X, UploadCloud, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [isUrlMode, setIsUrlMode] = useState(true);

  return (
    <div className={cn("space-y-4", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div className="relative group">
        {value ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <img 
              src={value} 
              alt="Upload preview" 
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted">
            <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <ImageIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">No image selected</p>
              <p className="text-xs">Enter a URL below to set the image</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => {
            // Placeholder for real file upload logic
            const mockUrl = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop";
            onChange(mockUrl);
          }}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Mock Upload
        </Button>
      </div>
    </div>
  );
}