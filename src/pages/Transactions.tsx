import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatZAR, CATEGORY_COLORS, type Category } from "@/lib/mock-data";
import { Search, Filter, Download, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useFinance } from "@/context/FinanceContext";

const CATEGORIES: Category[] = ["Food", "Transport", "Rent", "Airtime", "Entertainment", "School", "Personal", "Income"];

const Transactions = () => {
  const { transactions, addTransaction } = useFinance();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  // Form state
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState<"Card" | "Cash" | "EFT" | "App">("Card");
  const [date, setDate] = useState(today);

  const filtered = transactions.filter((t) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    const matchesFilter = filter === "all" || t.category === filter;
    return matchesQuery && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!description.trim()) {
      toast.error("Add a short description");
      return;
    }
    const finalCategory: Category = type === "income" ? "Income" : category;
    addTransaction({
      date,
      description: description.trim().slice(0, 80),
      category: finalCategory,
      amount: value,
      type,
      method,
    });
    toast.success("Transaction saved", {
      description: `${type === "income" ? "+" : "−"} ${formatZAR(value)} · ${finalCategory}`,
    });
    setAmount("");
    setDescription("");
  };

  return (
    <AppShell title="Income & Expenses" subtitle="Track every rand in and out">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Add transaction */}
        <div className="card-elevated p-5 lg:p-6 xl:col-span-1">
          <h3 className="font-display font-bold text-lg mb-1">Add transaction</h3>
          <p className="text-sm text-muted-foreground mb-5">Log a new income or expense</p>

          <Tabs value={type} onValueChange={(v) => setType(v as "expense" | "income")} className="mb-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="expense" className="gap-2">
                <ArrowUpCircle className="h-4 w-4" /> Expense
              </TabsTrigger>
              <TabsTrigger value="income" className="gap-2">
                <ArrowDownCircle className="h-4 w-4" /> Income
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">R</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-7 text-lg font-semibold h-11"
                  required
                />
              </div>
            </div>

            {type === "expense" && (
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c !== "Income").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Groceries at Checkers"
                maxLength={80}
                className="h-11"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Payment</Label>
                <Select value={method} onValueChange={(v) => setMethod(v as typeof method)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="EFT">EFT</SelectItem>
                    <SelectItem value="App">App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" className="h-11" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 shadow-soft">Save transaction</Button>
          </form>
        </div>

        {/* Transaction list */}
        <div className="xl:col-span-2 space-y-4">
          <div className="card-elevated p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by description or category"
                className="pl-9 h-10 bg-secondary/50 border-transparent"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px] h-10">
                <Filter className="h-4 w-4 mr-2" /> <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-10 gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
                    <th className="text-left font-semibold px-5 py-3">Description</th>
                    <th className="text-left font-semibold px-3 py-3 hidden sm:table-cell">Category</th>
                    <th className="text-left font-semibold px-3 py-3 hidden md:table-cell">Date</th>
                    <th className="text-left font-semibold px-3 py-3 hidden lg:table-cell">Method</th>
                    <th className="text-right font-semibold px-5 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-9 w-9 rounded-xl grid place-items-center text-xs font-bold shrink-0"
                            style={{
                              background: `${CATEGORY_COLORS[t.category]}1f`,
                              color: CATEGORY_COLORS[t.category],
                            }}
                          >
                            {t.category[0]}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{t.description}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">{t.category} • {t.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 hidden sm:table-cell">
                        <Badge variant="secondary">{t.category}</Badge>
                      </td>
                      <td className="px-3 py-3.5 hidden md:table-cell text-muted-foreground tabular-nums">{t.date}</td>
                      <td className="px-3 py-3.5 hidden lg:table-cell text-muted-foreground">{t.method}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={cn("font-semibold tabular-nums", t.type === "income" ? "text-success" : "text-foreground")}>
                          {t.type === "income" ? "+" : "−"} {formatZAR(t.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No transactions match your filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Transactions;
