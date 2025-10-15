import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Phone, Check, Clock, Download, Plus, Upload, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { EmailSetupGuide } from './EmailSetupGuide';
import { EmailNotificationBanner } from './EmailNotificationBanner';

interface Contact {
  id: string;
  name: string;
  phone: string;
  company: string;
  status: "pending" | "completed" | "in-progress";
  lastContact?: string;
  notes: string;
}

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    company: "Tech Solutions Inc",
    status: "pending",
    lastContact: "Oct 10, 2025",
    notes: "Interested in premium package. Follow up on pricing."
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    company: "Marketing Pro Ltd",
    status: "pending",
    lastContact: "Oct 8, 2025",
    notes: "Requested demo. Needs to discuss with team."
  },
  {
    id: "3",
    name: "Michael Chen",
    phone: "+1 (555) 345-6789",
    company: "Global Enterprises",
    status: "pending",
    notes: "New lead. Initial outreach."
  },
  {
    id: "4",
    name: "Emily Davis",
    phone: "+1 (555) 456-7890",
    company: "Creative Agency",
    status: "pending",
    lastContact: "Oct 12, 2025",
    notes: "Budget approval pending. Call back next week."
  },
  {
    id: "5",
    name: "David Wilson",
    phone: "+1 (555) 567-8901",
    company: "Innovation Labs",
    status: "pending",
    notes: "Warm lead from referral. Mention Tom's recommendation."
  },
  {
    id: "6",
    name: "Jennifer Martinez",
    phone: "+1 (555) 678-9012",
    company: "Digital Dynamics",
    status: "pending",
    lastContact: "Oct 13, 2025",
    notes: "Looking for enterprise solution. Schedule follow-up call."
  },
  {
    id: "7",
    name: "Robert Taylor",
    phone: "+1 (555) 789-0123",
    company: "Apex Consulting",
    status: "pending",
    notes: "Interested in annual contract. Send proposal by Friday."
  },
  {
    id: "8",
    name: "Lisa Anderson",
    phone: "+1 (555) 890-1234",
    company: "Blue Sky Media",
    status: "pending",
    lastContact: "Oct 11, 2025",
    notes: "Price sensitive. Highlight cost-effective options."
  },
  {
    id: "9",
    name: "James Thompson",
    phone: "+1 (555) 901-2345",
    company: "Stellar Systems",
    status: "pending",
    notes: "Technical questions about integration. Prepare technical specs."
  },
  {
    id: "10",
    name: "Maria Garcia",
    phone: "+1 (555) 012-3456",
    company: "Summit Solutions",
    status: "pending",
    lastContact: "Oct 9, 2025",
    notes: "Decision maker unavailable. Try again next Monday."
  },
  {
    id: "11",
    name: "Daniel Robinson",
    phone: "+1 (555) 123-4568",
    company: "NextGen Technologies",
    status: "pending",
    notes: "Hot lead from trade show. High priority contact."
  },
  {
    id: "12",
    name: "Patricia White",
    phone: "+1 (555) 234-5679",
    company: "Crown Industries",
    status: "pending",
    lastContact: "Oct 14, 2025",
    notes: "Comparing with competitors. Emphasize unique value proposition."
  },
  {
    id: "13",
    name: "Christopher Lee",
    phone: "+1 (555) 345-6780",
    company: "Horizon Group",
    status: "pending",
    notes: "Startup company. Flexible payment terms may be needed."
  },
  {
    id: "14",
    name: "Barbara Harris",
    phone: "+1 (555) 456-7891",
    company: "Prime Partners",
    status: "pending",
    lastContact: "Oct 7, 2025",
    notes: "Requested case studies. Send success stories before call."
  },
  {
    id: "15",
    name: "Matthew Clark",
    phone: "+1 (555) 567-8902",
    company: "Visionary Ventures",
    status: "pending",
    notes: "Multiple stakeholders involved. Prepare group presentation."
  },
  {
    id: "16",
    name: "Elizabeth Lewis",
    phone: "+1 (555) 678-9013",
    company: "Pacific Enterprises",
    status: "pending",
    lastContact: "Oct 6, 2025",
    notes: "Previous customer of competitor. Address pain points from old service."
  },
  {
    id: "17",
    name: "Thomas Walker",
    phone: "+1 (555) 789-0124",
    company: "Elite Solutions",
    status: "pending",
    notes: "Quick decision cycle expected. Be ready to close deal."
  }
];

const callScript = {
  greeting: "Hi [Name], this is [Your Name] calling from BTM Limited. How are you today?",
  purpose: "I'm reaching out to discuss how our services can help [Company] achieve [specific goal].",
  discovery: [
    "What are your current challenges with [relevant area]?",
    "What solutions have you tried before?",
    "What's your timeline for making a decision?"
  ],
  closing: "Based on what we discussed, I'd like to [next step]. Does [proposed time] work for you?"
};

export function ClientCRM() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentNotes, setCurrentNotes] = useState("");
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isEmailSetupOpen, setIsEmailSetupOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;
  
  // New contact form state
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    company: "",
    notes: ""
  });

  const handleStartCall = (contact: Contact) => {
    setSelectedContact(contact);
    setCurrentNotes(contact.notes);
    setIsCallDialogOpen(true);
    
    // Update status to in-progress
    setContacts(contacts.map(c => 
      c.id === contact.id ? { ...c, status: "in-progress" } : c
    ));
  };

  const handleCompleteCall = async () => {
    if (selectedContact) {
      // Update contact status locally
      setContacts(contacts.map(c => 
        c.id === selectedContact.id 
          ? { ...c, status: "completed", notes: currentNotes, lastContact: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } 
          : c
      ));
      
      // Send email notification via backend
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/send-call-notification`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              contactName: selectedContact.name,
              contactPhone: selectedContact.phone,
              company: selectedContact.company,
              notes: currentNotes,
              completedBy: 'CRM User',
              timestamp: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })
            })
          }
        );

        const data = await response.json();
        
        if (data.success) {
          console.log('[EMAIL] Notification sent successfully:', data);
          toast.success("Call completed! Email notifications sent to operations, quality assurance, and client care teams.", {
            duration: 5000
          });
        } else {
          console.error('[EMAIL ERROR]', data.error);
          toast.error("Call completed but email notification failed. Please check logs.");
        }
      } catch (error) {
        console.error('[EMAIL ERROR] Failed to send notification:', error);
        toast.warning("Call completed! Email notification is being processed.");
      }
      
      setIsCallDialogOpen(false);
      setSelectedContact(null);
      setCurrentNotes("");
    }
  };

  const handleAddContact = () => {
    // Validation
    if (!newContact.name.trim()) {
      toast.error("Please enter contact name");
      return;
    }
    if (!newContact.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }
    if (!newContact.company.trim()) {
      toast.error("Please enter company name");
      return;
    }

    // Create new contact object
    const contact: Contact = {
      id: (contacts.length + 1).toString(),
      name: newContact.name,
      phone: newContact.phone,
      company: newContact.company,
      status: "pending",
      notes: newContact.notes || "New contact added to call list."
    };

    // Add to contacts list
    setContacts([contact, ...contacts]);
    
    // Reset form
    setNewContact({
      name: "",
      phone: "",
      company: "",
      notes: ""
    });
    
    toast.success("Contact added to call list successfully!");
    setIsAddContactDialogOpen(false);
  };

  const handleExportList = () => {
    // Create CSV content
    const headers = ["Name", "Phone", "Company", "Status", "Last Contact", "Notes"];
    const csvContent = [
      headers.join(","),
      ...contacts.map(contact => [
        `"${contact.name}"`,
        `"${contact.phone}"`,
        `"${contact.company}"`,
        contact.status,
        `"${contact.lastContact || 'N/A'}"`,
        `"${contact.notes.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `daily-call-list-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Call list exported successfully!");
  };

  const handleImportList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row
        const dataLines = lines.slice(1);
        
        if (dataLines.length === 0) {
          toast.error("CSV file is empty");
          return;
        }

        const newContacts: Contact[] = [];
        let errorCount = 0;

        dataLines.forEach((line, index) => {
          // Parse CSV line (handle quoted fields)
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (!matches || matches.length < 3) {
            errorCount++;
            return;
          }

          const [name, phone, company, status, lastContact, notes] = matches.map(field => 
            field.replace(/^"|"$/g, '').replace(/""/g, '"')
          );

          if (!name || !phone || !company) {
            errorCount++;
            return;
          }

          const contact: Contact = {
            id: (contacts.length + newContacts.length + 1).toString(),
            name: name.trim(),
            phone: phone.trim(),
            company: company.trim(),
            status: (status && ['pending', 'completed', 'in-progress'].includes(status)) 
              ? status as Contact['status'] 
              : 'pending',
            lastContact: lastContact?.trim(),
            notes: notes?.trim() || "Imported from CSV"
          };

          newContacts.push(contact);
        });

        if (newContacts.length > 0) {
          setContacts([...newContacts, ...contacts]);
          toast.success(`Successfully imported ${newContacts.length} contact${newContacts.length > 1 ? 's' : ''}!${errorCount > 0 ? ` ${errorCount} row${errorCount > 1 ? 's' : ''} skipped due to errors.` : ''}`);
          setIsImportDialogOpen(false);
        } else {
          toast.error("No valid contacts found in CSV file");
        }

      } catch (error) {
        toast.error("Error reading CSV file. Please check the format.");
      }
    };

    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = ["Name", "Phone", "Company", "Status", "Last Contact", "Notes"];
    const exampleRow = ["John Doe", "+1 (555) 123-4567", "Tech Corp", "pending", "Oct 14, 2025", "Example contact"];
    const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "call-list-template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Template downloaded successfully!");
  };

  const pendingCount = contacts.filter(c => c.status === "pending").length;
  const completedCount = contacts.filter(c => c.status === "completed").length;

  // Pagination calculations
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const endIndex = startIndex + contactsPerPage;
  const currentContacts = contacts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <EmailNotificationBanner />
      
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2>Daily Call List</h2>
          <p className="text-muted-foreground">Today's scheduled client outreach</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Dialog open={isAddContactDialogOpen} onOpenChange={setIsAddContactDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Contact to Call List</DialogTitle>
                <DialogDescription>
                  Create a new contact for today's call list
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Name *</Label>
                    <Input
                      id="contact-name"
                      placeholder="Enter full name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="bg-white/60 backdrop-blur-xl border-white/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-company">Company *</Label>
                    <Input
                      id="contact-company"
                      placeholder="Enter company name"
                      value={newContact.company}
                      onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                      className="bg-white/60 backdrop-blur-xl border-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="pl-10 bg-white/60 backdrop-blur-xl border-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-notes">Initial Notes</Label>
                  <Textarea
                    id="contact-notes"
                    placeholder="Add any relevant information about this contact..."
                    value={newContact.notes}
                    onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                    rows={4}
                    className="bg-white/60 backdrop-blur-xl border-white/20"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsAddContactDialogOpen(false);
                    setNewContact({
                      name: "",
                      phone: "",
                      company: "",
                      notes: ""
                    });
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddContact}
                    className="bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Call List
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="bg-white/60 backdrop-blur-xl border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import List
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Call List</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to import multiple contacts at once
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-900 mb-2">CSV Format Requirements</h4>
                  <p className="text-blue-800 mb-3">
                    Your CSV file should include the following columns in order:
                  </p>
                  <ul className="list-disc list-inside text-blue-800 space-y-1 mb-3">
                    <li>Name (required)</li>
                    <li>Phone (required)</li>
                    <li>Company (required)</li>
                    <li>Status (optional: pending, completed, in-progress)</li>
                    <li>Last Contact (optional)</li>
                    <li>Notes (optional)</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="bg-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-file">Upload CSV File</Label>
                  <div className="relative">
                    <Input
                      ref={fileInputRef}
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={handleImportList}
                      className="bg-white/60 backdrop-blur-xl border-white/20 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-br file:from-violet-600 file:to-purple-600 file:text-white file:cursor-pointer hover:file:opacity-90"
                    />
                  </div>
                  <p className="text-muted-foreground">
                    Select a CSV file from your computer to import contacts
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            onClick={handleExportList}
            className="bg-white/60 backdrop-blur-xl border-white/20 shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
          
          <Dialog open={isEmailSetupOpen} onOpenChange={setIsEmailSetupOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Setup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Email Notification Setup</DialogTitle>
                <DialogDescription>
                  Configure email delivery for automated call completion notifications
                </DialogDescription>
              </DialogHeader>
              <EmailSetupGuide />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="invisible">
          <h2>Daily Call List</h2>
          <p className="text-muted-foreground">Today's scheduled client outreach</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-xl px-6 py-3 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/10 transition-all">
            <div className="text-muted-foreground">Pending</div>
            <div className="text-orange-600">{pendingCount}</div>
          </div>
          <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-xl px-6 py-3 shadow-lg shadow-green-500/5 hover:shadow-green-500/10 transition-all">
            <div className="text-muted-foreground">Completed</div>
            <div className="text-green-600">{completedCount}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {currentContacts.map((contact) => (
          <Card key={contact.id} className={`transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/10 bg-white/60 backdrop-blur-xl border-white/20 ${contact.status === "completed" ? "opacity-60" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{contact.name}</CardTitle>
                    <Badge variant={
                      contact.status === "completed" ? "default" : 
                      contact.status === "in-progress" ? "secondary" : 
                      "outline"
                    }>
                      {contact.status === "completed" && <Check className="w-3 h-3 mr-1" />}
                      {contact.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                      {contact.status === "pending" && <Phone className="w-3 h-3 mr-1" />}
                      {contact.status === "completed" ? "Completed" : 
                       contact.status === "in-progress" ? "In Progress" : 
                       "Pending"}
                    </Badge>
                  </div>
                  <CardDescription>{contact.company}</CardDescription>
                </div>
                <Dialog open={isCallDialogOpen && selectedContact?.id === contact.id} onOpenChange={(open) => {
                  setIsCallDialogOpen(open);
                  if (!open && selectedContact?.id === contact.id) {
                    setSelectedContact(null);
                    // Reset status back to pending if call wasn't completed
                    if (contact.status === "in-progress") {
                      setContacts(contacts.map(c => 
                        c.id === contact.id ? { ...c, status: "pending" } : c
                      ));
                    }
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={contact.status === "completed" ? "outline" : "default"}
                      disabled={contact.status === "in-progress" && selectedContact?.id !== contact.id}
                      onClick={() => handleStartCall(contact)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {contact.status === "completed" ? "Review" : "Start Call"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Call with {contact.name}</DialogTitle>
                      <DialogDescription>
                        {contact.phone} • {contact.company}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Call Script</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-muted-foreground">Greeting</p>
                            <p>{callScript.greeting.replace('[Name]', contact.name.split(' ')[0]).replace('[Your Name]', 'your name')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Purpose</p>
                            <p>{callScript.purpose.replace('[Company]', contact.company).replace('[specific goal]', 'their goals')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Discovery Questions</p>
                            <ul className="list-disc list-inside space-y-1">
                              {callScript.discovery.map((question, idx) => (
                                <li key={idx}>{question}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Closing</p>
                            <p>{callScript.closing}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-2">
                        <label htmlFor="notes">Call Notes & CRM Updates</label>
                        <Textarea
                          id="notes"
                          placeholder="Enter notes from the call..."
                          value={currentNotes}
                          onChange={(e) => setCurrentNotes(e.target.value)}
                          rows={6}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {
                          setIsCallDialogOpen(false);
                          setSelectedContact(null);
                          if (contact.status === "in-progress") {
                            setContacts(contacts.map(c => 
                              c.id === contact.id ? { ...c, status: "pending" } : c
                            ));
                          }
                        }}>
                          Cancel
                        </Button>
                        {contact.status !== "completed" && (
                          <Button onClick={handleCompleteCall}>
                            <Check className="w-4 h-4 mr-2" />
                            Complete Call
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </div>
                {contact.lastContact && (
                  <div className="text-muted-foreground">
                    Last Contact: {contact.lastContact}
                  </div>
                )}
                <div className="mt-3">
                  <p className="text-muted-foreground">Notes:</p>
                  <p>{contact.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, contacts.length)} of {contacts.length} contacts
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white/60 backdrop-blur-xl border-white/20"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={
                    currentPage === page
                      ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg"
                      : "bg-white/60 backdrop-blur-xl border-white/20"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white/60 backdrop-blur-xl border-white/20"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
