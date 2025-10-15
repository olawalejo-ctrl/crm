import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ClientCRM } from "./components/ClientCRM";
import { PromoSales } from "./components/PromoSales";
import { CustomerService } from "./components/CustomerService";
import { Toaster } from "./components/ui/sonner";
import { Phone, Tag, HeadphonesIcon, Sparkles } from "lucide-react";
import { BTMTravelLogo } from "./components/BTMTravelLogo";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header with gradient */}
      <div className="relative overflow-hidden border-b-2 border-white/30 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-blue-500/30 animate-pulse" />
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="container mx-auto px-6 py-12 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-white p-5 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform">
                  <BTMTravelLogo className="w-14 h-14" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-white drop-shadow-lg" style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                  BTMTravel CRM Platform
                </h1>
                <p className="text-white/90 flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                  <Sparkles className="w-5 h-5" />
                  Client Management & Sales Operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <Tabs defaultValue="client" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[650px] h-14 p-1 bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg shadow-purple-500/5">
            <TabsTrigger 
              value="client" 
              className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              Client CRM
            </TabsTrigger>
            <TabsTrigger 
              value="promo" 
              className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Tag className="w-4 h-4" />
              Promo Sales
            </TabsTrigger>
            <TabsTrigger 
              value="customer" 
              className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <HeadphonesIcon className="w-4 h-4" />
              Customer Service
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="space-y-6">
            <ClientCRM />
          </TabsContent>

          <TabsContent value="promo" className="space-y-6">
            <PromoSales />
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <CustomerService />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
}
