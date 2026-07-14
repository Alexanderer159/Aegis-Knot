import { BookOpen, FileText, Video, BookMarked, ChevronUp, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { knowledgeBase, type KBArticle } from "@/lib/knowledgeBase";
import { cn } from "@/lib/utils";
import { useState } from "react";

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  video: Video,
  guide: BookMarked,
};

const categories = ["Todos", "Primeros Auxilios", "Supervivencia", "Comunicaciones", "Refugio"];

export default function Vault() {
  const [selectedCat, setSelectedCat] = useState("Todos");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = knowledgeBase.filter((a) => {
    const matchCat = selectedCat === "Todos" || a.category === selectedCat;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.sections.some(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.content.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5">
      <h2 className="text-3xl text-center">GUIAS</h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar protocolo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border"/>
      </div>

      {/* Category Tabs */}
      <div className="grid gap-2 ">
        {categories.map((cat) => (
          <Button key={cat} onClick={() => setSelectedCat(cat)} className={selectedCat === cat ? "bg-primary text-secondary" : "border bg-secondary text-white"} >
            {cat}
          </Button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-2">
        {filtered.map((article) => {
          const Icon = typeIcons[article.type];
          const isExpanded = expandedId === article.id;
          return (
            <Card key={article.id} className={cn("transition-all duration-500", isExpanded && "border-primary")}>
              <CardContent className="py-3">
                <button onClick={() => setExpandedId(isExpanded ? null : article.id)} className="flex items-center gap-3 w-full text-left">
                  
                    <Icon className="h-5 w-5 text-primary" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-heading font-semibold truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground">{article.category} • {article.sections.length} secciones</p>
                  </div>
                  <ChevronUp className={isExpanded ? `h-4 w-4 text-primary shrink-0 rotate-180 duration-300 transition-all` : `h-4 w-4 text-muted-foreground shrink-0 duration-300 transition-all`} />  
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    {article.sections.map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-sm font-heading font-bold text-primary">{section.title}</h4>
                        <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed font-mono text-xs bg-secondary/50 rounded-lg p-3">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Sin resultados</p>
        </div>
      )}
    </div>
  );
}
