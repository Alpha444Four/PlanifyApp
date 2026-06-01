import { useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { useI18n } from "@/hooks/use-i18n";



const KEY = "planify:shopping";



export function ShoppingList() {

  const { t } = useI18n();

  const [items, setItems] = useState<string[]>(() => {

    try {

      return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];

    } catch {

      return [];

    }

  });

  const [draft, setDraft] = useState("");



  const persist = (next: string[]) => {

    setItems(next);

    localStorage.setItem(KEY, JSON.stringify(next));

  };



  const add = () => {

    const trimmed = draft.trim();

    if (!trimmed) return;

    persist([...items, trimmed]);

    setDraft("");

  };



  return (

    <Card>

      <CardHeader>

        <CardTitle>{t("personal.shopping")}</CardTitle>

      </CardHeader>

      <CardContent className="space-y-3">

        <div className="flex gap-2">

          <Input

            value={draft}

            onChange={(e) => setDraft(e.target.value)}

            placeholder={t("personal.shoppingPlaceholder")}

            onKeyDown={(e) => e.key === "Enter" && add()}

          />

          <Button variant="gradient" size="icon" onClick={add} aria-label={t("common.add")}>

            <Plus className="h-4 w-4" />

          </Button>

        </div>

        <ul className="space-y-2">

          {items.map((item) => (

            <li

              key={item}

              className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm"

            >

              {item}

              <button

                type="button"

                className="text-muted-foreground hover:text-destructive"

                onClick={() => persist(items.filter((x) => x !== item))}

                aria-label={t("common.remove")}

              >

                <Trash2 className="h-4 w-4" />

              </button>

            </li>

          ))}

        </ul>

      </CardContent>

    </Card>

  );

}

