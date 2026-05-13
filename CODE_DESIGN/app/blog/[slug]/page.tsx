"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { createClient } from "@/lib/supabase";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();
      setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16">
        <article className="container px-4 mx-auto max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>

          <div className="space-y-4 mb-8">
            <Badge>{article.category || "Fitness"}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{article.title}</h1>
            <div className="text-sm text-muted-foreground">
              Published on {format(new Date(article.created_at), "MMMM d, yyyy")}
            </div>
          </div>

          {article.featured_image && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-12">
              <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}