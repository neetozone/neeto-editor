import { t } from "i18next";
import {
  Info,
  AlertTriangle,
  AlertOctagon,
  Megaphone,
  CheckCircle2,
} from "lucide-react";

export const CALLOUT_TYPES = [
  {
    type: "default",
    label: t("neetoEditor.menu.calloutDefault"),
    icon: Megaphone,
    bgColor: "--neeto-editor-gray-100",
  },
  {
    type: "info",
    label: t("neetoEditor.menu.calloutInfo"),
    icon: Info,
    bgColor: "--neeto-editor-info-100",
    iconColor: "var(--ne-editor-content-callout-info-foreground-color)",
  },
  {
    type: "warning",
    label: t("neetoEditor.menu.calloutWarning"),
    icon: AlertTriangle,
    bgColor: "--neeto-editor-warning-100",
    iconColor: "var(--ne-editor-content-callout-warning-foreground-color)",
  },
  {
    type: "error",
    label: t("neetoEditor.menu.calloutError"),
    icon: AlertOctagon,
    bgColor: "--neeto-editor-error-100",
    iconColor: "var(--ne-editor-content-callout-error-foreground-color)",
  },
  {
    type: "success",
    label: t("neetoEditor.menu.calloutSuccess"),
    icon: CheckCircle2,
    bgColor: "--neeto-editor-success-100",
    iconColor: "var(--ne-editor-content-callout-success-foreground-color)",
  },
];
