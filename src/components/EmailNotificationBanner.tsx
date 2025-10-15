import { useState, useEffect } from "react";
import { Mail, Settings } from "lucide-react";
import { Badge } from "./ui/badge";
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function EmailNotificationBanner() {
  const [recipientCount, setRecipientCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipientCount();
  }, []);

  const fetchRecipientCount = async () => {
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
        setRecipientCount(data.recipients.length);
      }
    } catch (error) {
      console.error('[EMAIL BANNER] Failed to fetch recipient count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Email Notifications Active</h3>
            <p className="text-xs text-muted-foreground">
              Call completion alerts configured for{" "}
              {isLoading ? "..." : (
                <span className="font-medium text-blue-600">{recipientCount} recipient{recipientCount !== 1 ? 's' : ''}</span>
              )}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5 bg-white/60">
          <Settings className="w-3 h-3" />
          Managed in Email Setup
        </Badge>
      </div>
    </div>
  );
}
