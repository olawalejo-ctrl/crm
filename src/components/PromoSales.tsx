import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Tag, Eye, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface Promotion {
  id: string;
  name: string;
  code: string;
  discount: string;
  website: string;
  status: "active" | "scheduled" | "expired";
  startDate: string;
  endDate: string;
  usage: number;
  target: number;
  revenue: number;
  views: number;
  conversions: number;
}

const initialPromotions: Promotion[] = [
  {
    id: "1",
    name: "Summer Special 2025",
    code: "SUMMER25",
    discount: "25% off",
    website: "holiday.btmtravel.net",
    status: "active",
    startDate: "Oct 1, 2025",
    endDate: "Oct 31, 2025",
    usage: 145,
    target: 200,
    revenue: 14500,
    views: 2340,
    conversions: 145
  },
  {
    id: "2",
    name: "New Client Welcome",
    code: "WELCOME20",
    discount: "20% off",
    website: "holiday.btmtravel.net",
    status: "active",
    startDate: "Oct 1, 2025",
    endDate: "Dec 31, 2025",
    usage: 89,
    target: 150,
    revenue: 8900,
    views: 1580,
    conversions: 89
  },
  {
    id: "3",
    name: "Referral Bonus",
    code: "REFER15",
    discount: "15% off",
    website: "holiday.btmtravel.net",
    status: "active",
    startDate: "Sep 15, 2025",
    endDate: "Nov 15, 2025",
    usage: 67,
    target: 100,
    revenue: 6700,
    views: 890,
    conversions: 67
  },
  {
    id: "4",
    name: "Flash Sale October",
    code: "FLASH30",
    discount: "30% off",
    website: "holiday.btmtravel.net",
    status: "scheduled",
    startDate: "Oct 20, 2025",
    endDate: "Oct 22, 2025",
    usage: 0,
    target: 300,
    revenue: 0,
    views: 0,
    conversions: 0
  },
  {
    id: "5",
    name: "Early Bird September",
    code: "EARLY20",
    discount: "20% off",
    website: "holiday.btmtravel.net",
    status: "expired",
    startDate: "Sep 1, 2025",
    endDate: "Sep 30, 2025",
    usage: 234,
    target: 200,
    revenue: 23400,
    views: 3200,
    conversions: 234
  }
];

export function PromoSales() {
  const [promotions] = useState<Promotion[]>(initialPromotions);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activePromos = promotions.filter(p => p.status === "active");
  const totalRevenue = activePromos.reduce((sum, p) => sum + p.revenue, 0);
  const totalConversions = activePromos.reduce((sum, p) => sum + p.conversions, 0);
  const avgConversionRate = activePromos.length > 0 
    ? (activePromos.reduce((sum, p) => sum + (p.conversions / p.views * 100), 0) / activePromos.length).toFixed(1)
    : 0;

  const handleViewDetails = (promo: Promotion) => {
    setSelectedPromo(promo);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Promotional Performance</h2>
        <p className="text-muted-foreground">Track and manage all active promotions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3 relative">
            <CardDescription className="text-purple-100">Active Promotions</CardDescription>
            <CardTitle className="flex items-center gap-2">
              {activePromos.length}
              <Tag className="w-5 h-5 text-purple-100" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3 relative">
            <CardDescription className="text-green-100">Total Revenue</CardDescription>
            <CardTitle className="flex items-center gap-2">
              ${totalRevenue.toLocaleString()}
              <TrendingUp className="w-5 h-5 text-green-100" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3 relative">
            <CardDescription className="text-blue-100">Avg. Conversion Rate</CardDescription>
            <CardTitle className="flex items-center gap-2">
              {avgConversionRate}%
              <ShoppingCart className="w-5 h-5 text-blue-100" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
          <CardDescription>Manage and monitor promotional campaigns across all websites</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => {
                const progressPercent = (promo.usage / promo.target) * 100;
                const conversionRate = promo.views > 0 ? ((promo.conversions / promo.views) * 100).toFixed(1) : "0.0";
                
                return (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <div>
                        <div>{promo.name}</div>
                        <div className="text-muted-foreground">{promo.discount}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{promo.code}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{promo.website}</TableCell>
                    <TableCell>
                      <Badge variant={
                        promo.status === "active" ? "default" :
                        promo.status === "scheduled" ? "secondary" :
                        "outline"
                      }>
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-32">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{promo.usage}/{promo.target}</span>
                          <span className="text-muted-foreground">{progressPercent.toFixed(0)}%</span>
                        </div>
                        <Progress value={progressPercent} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          <span>{promo.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          <span>{conversionRate}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(promo)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedPromo && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPromo.name}</DialogTitle>
                <DialogDescription>
                  {selectedPromo.startDate} - {selectedPromo.endDate}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Promo Code</CardDescription>
                    <CardTitle className="font-mono">{selectedPromo.code}</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Discount</CardDescription>
                    <CardTitle>{selectedPromo.discount}</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Website</CardDescription>
                    <CardTitle className="text-muted-foreground">{selectedPromo.website}</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Status</CardDescription>
                    <Badge variant={
                      selectedPromo.status === "active" ? "default" :
                      selectedPromo.status === "scheduled" ? "secondary" :
                      "outline"
                    } className="w-fit">
                      {selectedPromo.status}
                    </Badge>
                  </CardHeader>
                </Card>
              </div>

              <div className="space-y-4 mt-4">
                <h4>Performance Metrics</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Total Usage</p>
                    <p>{selectedPromo.usage} / {selectedPromo.target}</p>
                    <Progress value={(selectedPromo.usage / selectedPromo.target) * 100} className="mt-2" />
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Revenue Generated</p>
                    <p className="flex items-center gap-2">
                      ${selectedPromo.revenue.toLocaleString()}
                      {selectedPromo.revenue > 10000 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Page Views</p>
                    <p>{selectedPromo.views.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Conversion Rate</p>
                    <p>
                      {selectedPromo.views > 0 
                        ? ((selectedPromo.conversions / selectedPromo.views) * 100).toFixed(1)
                        : "0.0"}%
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
