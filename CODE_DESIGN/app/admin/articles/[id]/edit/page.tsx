"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArticleForm } from "@/components/admin/articles/article-form";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) throw error;
        setArticle(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading article data...</div>;
  if (!article) return <div>Article not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
        <p className="text-muted-foreground">Update your blog post content.</p>
      </div>
      <ArticleForm initialData={article} />
    </div>
  );
}