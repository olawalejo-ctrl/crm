import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mail, Phone, User, Calendar, ShoppingBag, Search, UserPlus, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContact: string;
  status: "active" | "inactive" | "vip" | "corporate";
  totalPurchases: number;
  purchaseHistory: {
    id: string;
    date: string;
    product: string;
    amount: number;
    status: string;
  }[];
  notes: string;
}

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Robert Johnson",
    email: "robert.j@email.com",
    phone: "+1 (555) 111-2222",
    lastContact: "Oct 13, 2025",
    status: "vip",
    totalPurchases: 15,
    purchaseHistory: [
      { id: "P1", date: "Oct 10, 2025", product: "Premium Service Package", amount: 2500, status: "Completed" },
      { id: "P2", date: "Sep 15, 2025", product: "Standard Package", amount: 1200, status: "Completed" },
      { id: "P3", date: "Aug 20, 2025", product: "Consulting Services", amount: 800, status: "Completed" }
    ],
    notes: "VIP client. Prefers email communication. Interested in annual contract."
  },
  {
    id: "2",
    name: "Amanda Martinez",
    email: "amanda.m@company.com",
    phone: "+1 (555) 222-3333",
    lastContact: "Oct 12, 2025",
    status: "active",
    totalPurchases: 8,
    purchaseHistory: [
      { id: "P4", date: "Oct 5, 2025", product: "Basic Package", amount: 600, status: "Completed" },
      { id: "P5", date: "Sep 1, 2025", product: "Add-on Services", amount: 350, status: "Completed" }
    ],
    notes: "Regular customer. Sometimes needs payment extensions."
  },
  {
    id: "3",
    name: "Christopher Lee",
    email: "chris.lee@business.net",
    phone: "+1 (555) 333-4444",
    lastContact: "Oct 8, 2025",
    status: "active",
    totalPurchases: 12,
    purchaseHistory: [
      { id: "P6", date: "Sep 28, 2025", product: "Enterprise Package", amount: 3500, status: "Completed" },
      { id: "P7", date: "Aug 15, 2025", product: "Premium Service", amount: 2200, status: "Completed" }
    ],
    notes: "Expanding business. Potential for upgrade to enterprise level."
  },
  {
    id: "4",
    name: "Jessica Taylor",
    email: "j.taylor@startup.io",
    phone: "+1 (555) 444-5555",
    lastContact: "Oct 6, 2025",
    status: "active",
    totalPurchases: 5,
    purchaseHistory: [
      { id: "P8", date: "Sep 20, 2025", product: "Starter Package", amount: 450, status: "Completed" },
      { id: "P9", date: "Aug 10, 2025", product: "Support Services", amount: 200, status: "Completed" }
    ],
    notes: "New startup. Budget conscious but growing quickly."
  },
  {
    id: "5",
    name: "William Brown",
    email: "w.brown@corp.com",
    phone: "+1 (555) 555-6666",
    lastContact: "Sep 28, 2025",
    status: "inactive",
    totalPurchases: 3,
    purchaseHistory: [
      { id: "P10", date: "Aug 1, 2025", product: "Basic Service", amount: 500, status: "Completed" }
    ],
    notes: "Has not responded to recent follow-ups. Consider re-engagement campaign."
  },
  {
    id: "6",
    name: "Sophia Anderson",
    email: "sophia.a@enterprise.com",
    phone: "+1 (555) 666-7777",
    lastContact: "Oct 14, 2025",
    status: "vip",
    totalPurchases: 20,
    purchaseHistory: [
      { id: "P11", date: "Oct 12, 2025", product: "Premium Plus Package", amount: 4500, status: "Completed" },
      { id: "P12", date: "Sep 25, 2025", product: "Consulting Hours", amount: 1800, status: "Completed" },
      { id: "P13", date: "Sep 10, 2025", product: "Custom Solution", amount: 3200, status: "Completed" }
    ],
    notes: "Long-term VIP client. Annual contract renewal due next month."
  }
];

export function CustomerService() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseNote, setResponseNote] = useState("");
  
  // Add customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive" | "vip" | "corporate",
    notes: ""
  });

  // Purchase history management state
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<{ id: string; date: string; product: string; amount: number; status: string; } | null>(null);
  const [purchaseForm, setPurchaseForm] = useState({
    date: "",
    product: "",
    amount: "",
    status: "Completed"
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setResponseNote("");
    setIsDialogOpen(true);
  };

  const handleSendResponse = () => {
    if (selectedCustomer && responseNote.trim()) {
      // Update customer notes
      setCustomers(customers.map(c =>
        c.id === selectedCustomer.id
          ? { ...c, notes: `${c.notes}\n\n[${new Date().toLocaleDateString()}] ${responseNote}`, lastContact: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
          : c
      ));
      
      toast.success("Response sent to customer and notes updated!");
      setResponseNote("");
      setIsDialogOpen(false);
    }
  };

  const handleAddCustomer = () => {
    // Validation
    if (!newCustomer.name.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (!newCustomer.email.trim()) {
      toast.error("Please enter customer email");
      return;
    }
    if (!newCustomer.phone.trim()) {
      toast.error("Please enter customer phone");
      return;
    }

    // Create new customer object
    const customer: Customer = {
      id: (customers.length + 1).toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      status: newCustomer.status,
      lastContact: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      totalPurchases: 0,
      purchaseHistory: [],
      notes: newCustomer.notes || "New customer added to system."
    };

    // Add to customers list
    setCustomers([customer, ...customers]);
    
    // Reset form
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      status: "active",
      notes: ""
    });
    
    toast.success("Customer added successfully!");
    setIsAddDialogOpen(false);
  };

  const handleAddPurchase = () => {
    if (!selectedCustomer) return;

    // Validation
    if (!purchaseForm.date.trim()) {
      toast.error("Please enter purchase date");
      return;
    }
    if (!purchaseForm.product.trim()) {
      toast.error("Please enter product/service name");
      return;
    }
    if (!purchaseForm.amount || parseFloat(purchaseForm.amount) <= 0) {
      toast.error("Please enter valid amount");
      return;
    }

    const newPurchase = {
      id: `P${Date.now()}`,
      date: purchaseForm.date,
      product: purchaseForm.product,
      amount: parseFloat(purchaseForm.amount),
      status: purchaseForm.status
    };

    // Update customer with new purchase
    setCustomers(customers.map(c => 
      c.id === selectedCustomer.id 
        ? { 
            ...c, 
            purchaseHistory: [...c.purchaseHistory, newPurchase],
            totalPurchases: c.totalPurchases + 1
          } 
        : c
    ));

    // Update selected customer
    setSelectedCustomer({
      ...selectedCustomer,
      purchaseHistory: [...selectedCustomer.purchaseHistory, newPurchase],
      totalPurchases: selectedCustomer.totalPurchases + 1
    });

    // Reset form
    setPurchaseForm({
      date: "",
      product: "",
      amount: "",
      status: "Completed"
    });

    toast.success("Purchase added successfully!");
    setIsPurchaseDialogOpen(false);
  };

  const handleEditPurchase = () => {
    if (!selectedCustomer || !editingPurchase) return;

    // Validation
    if (!purchaseForm.date.trim()) {
      toast.error("Please enter purchase date");
      return;
    }
    if (!purchaseForm.product.trim()) {
      toast.error("Please enter product/service name");
      return;
    }
    if (!purchaseForm.amount || parseFloat(purchaseForm.amount) <= 0) {
      toast.error("Please enter valid amount");
      return;
    }

    const updatedPurchase = {
      id: editingPurchase.id,
      date: purchaseForm.date,
      product: purchaseForm.product,
      amount: parseFloat(purchaseForm.amount),
      status: purchaseForm.status
    };

    // Update customer with edited purchase
    setCustomers(customers.map(c => 
      c.id === selectedCustomer.id 
        ? { 
            ...c, 
            purchaseHistory: c.purchaseHistory.map(p => 
              p.id === editingPurchase.id ? updatedPurchase : p
            )
          } 
        : c
    ));

    // Update selected customer
    setSelectedCustomer({
      ...selectedCustomer,
      purchaseHistory: selectedCustomer.purchaseHistory.map(p => 
        p.id === editingPurchase.id ? updatedPurchase : p
      )
    });

    // Reset form
    setPurchaseForm({
      date: "",
      product: "",
      amount: "",
      status: "Completed"
    });
    setEditingPurchase(null);

    toast.success("Purchase updated successfully!");
    setIsPurchaseDialogOpen(false);
  };

  const handleDeletePurchase = (purchaseId: string) => {
    if (!selectedCustomer) return;

    // Update customer by removing purchase
    setCustomers(customers.map(c => 
      c.id === selectedCustomer.id 
        ? { 
            ...c, 
            purchaseHistory: c.purchaseHistory.filter(p => p.id !== purchaseId),
            totalPurchases: Math.max(0, c.totalPurchases - 1)
          } 
        : c
    ));

    // Update selected customer
    setSelectedCustomer({
      ...selectedCustomer,
      purchaseHistory: selectedCustomer.purchaseHistory.filter(p => p.id !== purchaseId),
      totalPurchases: Math.max(0, selectedCustomer.totalPurchases - 1)
    });

    toast.success("Purchase deleted successfully!");
  };

  const openAddPurchaseDialog = () => {
    setEditingPurchase(null);
    setPurchaseForm({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      product: "",
      amount: "",
      status: "Completed"
    });
    setIsPurchaseDialogOpen(true);
  };

  const openEditPurchaseDialog = (purchase: { id: string; date: string; product: string; amount: number; status: string; }) => {
    setEditingPurchase(purchase);
    setPurchaseForm({
      date: purchase.date,
      product: purchase.product,
      amount: purchase.amount.toString(),
      status: purchase.status
    });
    setIsPurchaseDialogOpen(true);
  };

  const activeCustomers = customers.filter(c => c.status === "active" || c.status === "vip").length;
  const vipCustomers = customers.filter(c => c.status === "vip").length;
  const totalRevenue = customers.reduce((sum, c) => 
    sum + c.purchaseHistory.reduce((pSum, p) => pSum + p.amount, 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2>Customer Service Portal</h2>
          <p className="text-muted-foreground">Manage existing customer relationships and support</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Add an existing customer to the system
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="bg-white/60 backdrop-blur-xl border-white/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    value={newCustomer.status} 
                    onValueChange={(value: "active" | "inactive" | "vip" | "corporate") => 
                      setNewCustomer({ ...newCustomer, status: value })
                    }
                  >
                    <SelectTrigger className="bg-white/60 backdrop-blur-xl border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="customer@email.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="pl-10 bg-white/60 backdrop-blur-xl border-white/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      className="pl-10 bg-white/60 backdrop-blur-xl border-white/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Customer Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any relevant information about this customer..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  rows={4}
                  className="bg-white/60 backdrop-blur-xl border-white/20"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewCustomer({
                    name: "",
                    email: "",
                    phone: "",
                    status: "active",
                    notes: ""
                  });
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCustomer}
                  className="bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="invisible">
          <h2>Customer Service Portal</h2>
          <p className="text-muted-foreground">Manage existing customer relationships and support</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
            <div className="text-blue-100">Active</div>
            <div>{activeCustomers}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl px-6 py-3 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
            <div className="text-amber-100">VIP</div>
            <div>{vipCustomers}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl px-6 py-3 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all">
            <div className="text-green-100">Revenue</div>
            <div>${(totalRevenue / 1000).toFixed(0)}k</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 bg-white/60 backdrop-blur-xl border-white/20 shadow-lg focus:shadow-xl focus:shadow-purple-500/10 transition-all"
        />
      </div>

      <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>View and manage all existing customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const totalSpent = customer.purchaseHistory.reduce((sum, p) => sum + p.amount, 0);
                
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{customer.lastContact}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        customer.status === "vip" ? "default" :
                        customer.status === "corporate" ? "default" :
                        customer.status === "active" ? "secondary" :
                        "outline"
                      }>
                        {customer.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-muted-foreground" />
                        <span>{customer.totalPurchases}</span>
                      </div>
                    </TableCell>
                    <TableCell>${totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewCustomer(customer)}>
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
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedCustomer.name}
                  <Badge variant={
                    selectedCustomer.status === "vip" ? "default" :
                    selectedCustomer.status === "corporate" ? "default" :
                    selectedCustomer.status === "active" ? "secondary" :
                    "outline"
                  }>
                    {selectedCustomer.status.toUpperCase()}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Complete customer profile and interaction history
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Email</CardDescription>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Phone</CardDescription>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Last Contact</CardDescription>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCustomer.lastContact}</span>
                      </div>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Total Purchases</CardDescription>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCustomer.totalPurchases} orders</span>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Purchase History</CardTitle>
                      <Button 
                        size="sm"
                        onClick={openAddPurchaseDialog}
                        className="bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Purchase
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedCustomer.purchaseHistory.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No purchase history yet</p>
                        <p className="text-sm">Add the first purchase to get started</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Product/Service</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCustomer.purchaseHistory.map((purchase) => (
                            <TableRow key={purchase.id}>
                              <TableCell className="text-muted-foreground">{purchase.date}</TableCell>
                              <TableCell>{purchase.product}</TableCell>
                              <TableCell>${purchase.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{purchase.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditPurchaseDialog(purchase)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm("Are you sure you want to delete this purchase?")) {
                                        handleDeletePurchase(purchase.id);
                                      }
                                    }}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <label>Customer Notes</label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedCustomer.notes}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="response">Send Response / Add Note</label>
                  <Textarea
                    id="response"
                    placeholder="Enter your response or add notes..."
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={handleSendResponse} disabled={!responseNote.trim()}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Purchase Add/Edit Dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPurchase ? "Edit Purchase" : "Add New Purchase"}</DialogTitle>
            <DialogDescription>
              {editingPurchase ? "Update purchase details" : "Add a new purchase to customer history"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-date">Purchase Date *</Label>
                <Input
                  id="purchase-date"
                  placeholder="Oct 14, 2025"
                  value={purchaseForm.date}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, date: e.target.value })}
                  className="bg-white/60 backdrop-blur-xl border-white/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchase-amount">Amount (USD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="purchase-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={purchaseForm.amount}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })}
                    className="pl-7 bg-white/60 backdrop-blur-xl border-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-product">Product/Service Name *</Label>
              <Input
                id="purchase-product"
                placeholder="Enter product or service name"
                value={purchaseForm.product}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, product: e.target.value })}
                className="bg-white/60 backdrop-blur-xl border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-status">Status *</Label>
              <Select 
                value={purchaseForm.status} 
                onValueChange={(value) => setPurchaseForm({ ...purchaseForm, status: value })}
              >
                <SelectTrigger className="bg-white/60 backdrop-blur-xl border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsPurchaseDialogOpen(false);
                setEditingPurchase(null);
                setPurchaseForm({
                  date: "",
                  product: "",
                  amount: "",
                  status: "Completed"
                });
              }}>
                Cancel
              </Button>
              <Button 
                onClick={editingPurchase ? handleEditPurchase : handleAddPurchase}
                className="bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20"
              >
                {editingPurchase ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Purchase
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Purchase
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
