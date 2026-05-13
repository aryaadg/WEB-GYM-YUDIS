"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

export default function PublicBlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl font-bold">Fitness Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tips, news, and insights to keep you motivated and informed.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">No articles published yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all group">
                    <div className="aspect-video overflow-hidden">
                      {article.featured_image ? (
                        <img 
                          src={article.featured_image} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{article.category || "Fitness"}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(article.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm font-medium text-primary">
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}