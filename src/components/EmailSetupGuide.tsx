import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, CheckCircle2, ExternalLink, Plus, X, Mail, Save } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function EmailSetupGuide() {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/email-recipients`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setRecipients(data.recipients);
      }
    } catch (error) {
      console.error('[EMAIL RECIPIENTS] Failed to fetch:', error);
      toast.error("Failed to load email recipients");
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipients = async () => {
    if (recipients.length === 0) {
      toast.error("Please add at least one email recipient");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/email-recipients`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ emails: recipients })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast.success("Email recipients updated successfully!");
      } else {
        toast.error(data.error || "Failed to update recipients");
      }
    } catch (error) {
      console.error('[EMAIL RECIPIENTS] Failed to save:', error);
      toast.error("Failed to save email recipients");
    } finally {
      setIsSaving(false);
    }
  };

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail) {
      toast.error("Please enter an email address");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (recipients.includes(trimmedEmail)) {
      toast.error("This email is already in the list");
      return;
    }

    setRecipients([...recipients, trimmedEmail]);
    setNewEmail("");
    toast.success("Email added! Don't forget to save changes.");
  };

  const removeEmail = (emailToRemove: string) => {
    setRecipients(recipients.filter(email => email !== emailToRemove));
    toast.success("Email removed! Don't forget to save changes.");
  };

  return (
    <div className="space-y-4 mt-4">
        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">Backend Connected</p>
            <p className="text-sm text-muted-foreground">
              Your CRM is connected to Supabase and logging all call completions.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">Email Service Required</p>
            <p className="text-sm text-muted-foreground mb-2">
              To send actual emails, you need to configure an email service provider.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Recommended Options:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Easiest</Badge>
                  <a 
                    href="https://resend.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Resend.com <ExternalLink className="w-3 h-3" />
                  </a>
                  - Free tier: 100 emails/day
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Popular</Badge>
                  <a 
                    href="https://sendgrid.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    SendGrid <ExternalLink className="w-3 h-3" />
                  </a>
                  - Free tier: 100 emails/day
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium mb-2">Quick Setup Steps:</p>
          <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
            <li>Sign up for an email service (Resend recommended)</li>
            <li>Get your API key from the provider</li>
            <li>Add the API key to your Supabase environment variables</li>
            <li>Update the server code to integrate with the provider</li>
          </ol>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-700" />
              <p className="text-sm font-medium text-green-900">Email Notification Recipients</p>
            </div>
            <Badge variant="outline" className="text-xs bg-white">
              {recipients.length} {recipients.length === 1 ? 'recipient' : 'recipients'}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            All call completion notifications will be sent to these email addresses:
          </p>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading recipients...</div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {recipients.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    No recipients configured. Add at least one email address below.
                  </div>
                ) : (
                  recipients.map((email, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-200 group hover:border-green-300 transition-colors"
                  >
                    <span className="text-sm text-green-900">{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmail(email)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  ))
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-green-200">
                <Label htmlFor="new-email" className="text-sm font-medium text-green-900">
                  Add New Recipient
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="email@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addEmail();
                      }
                    }}
                    className="flex-1 bg-white border-green-200 focus:border-green-400"
                  />
                  <Button
                    onClick={addEmail}
                    variant="outline"
                    className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                <Button
                  onClick={saveRecipients}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-br from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Recipients"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
  );
}
