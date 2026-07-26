import { motion, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useProfilePreferences } from "@/hooks/useProfilePreferences";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function PreferencesSettings() {
  const {
    data: preferences,
    isLoading: isPreferencesLoading,
    savePreferences,
    isSaving,
  } = useProfilePreferences();

  return (
    <div className="space-y-6">
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>
              Appearance{" "}
              <span className="text-sm text-muted-foreground">
                "Coming Soon"
              </span>
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the app
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={preferences?.allow_email_notifications ?? true}
                onCheckedChange={(checked) =>
                  savePreferences({
                    allow_email_notifications: checked,
                    allow_expiry_reminders:
                      preferences?.allow_expiry_reminders ?? true,
                    allow_risk_alerts: preferences?.allow_risk_alerts ?? true,
                    allow_analysis_alerts:
                      preferences?.allow_analysis_alerts ?? true,
                  })
                }
                disabled={isPreferencesLoading || isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analysis Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when analysis is complete
                </p>
              </div>
              <Switch
                checked={preferences?.allow_analysis_alerts ?? true}
                onCheckedChange={(checked) =>
                  savePreferences({
                    allow_email_notifications:
                      preferences?.allow_email_notifications ?? true,
                    allow_expiry_reminders:
                      preferences?.allow_expiry_reminders ?? true,
                    allow_risk_alerts: preferences?.allow_risk_alerts ?? true,
                    allow_analysis_alerts: checked,
                  })
                }
                disabled={isPreferencesLoading || isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Expiry Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Reminders before contract expiration
                </p>
              </div>
              <Switch
                checked={preferences?.allow_expiry_reminders ?? true}
                onCheckedChange={(checked) =>
                  savePreferences({
                    allow_email_notifications:
                      preferences?.allow_email_notifications ?? true,
                    allow_expiry_reminders: checked,
                    allow_risk_alerts: preferences?.allow_risk_alerts ?? true,
                    allow_analysis_alerts:
                      preferences?.allow_analysis_alerts ?? true,
                  })
                }
                disabled={isPreferencesLoading || isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Risk Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alerts for high-risk documents
                </p>
              </div>
              <Switch
                checked={preferences?.allow_risk_alerts ?? true}
                onCheckedChange={(checked) =>
                  savePreferences({
                    allow_email_notifications:
                      preferences?.allow_email_notifications ?? true,
                    allow_expiry_reminders:
                      preferences?.allow_expiry_reminders ?? true,
                    allow_risk_alerts: checked,
                    allow_analysis_alerts:
                      preferences?.allow_analysis_alerts ?? true,
                  })
                }
                disabled={isPreferencesLoading || isSaving}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
