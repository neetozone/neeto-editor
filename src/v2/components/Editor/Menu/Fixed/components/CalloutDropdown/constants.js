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
  },
  {
    type: "warning",
    label: t("neetoEditor.menu.calloutWarning"),
    icon: AlertTriangle,
    bgColor: "--neeto-editor-warning-100",
  },
  {
    type: "error",
    label: t("neetoEditor.menu.calloutError"),
    icon: AlertOctagon,
    bgColor: "--neeto-editor-error-100",
  },
  {
    type: "success",
    label: t("neetoEditor.menu.calloutSuccess"),
    icon: CheckCircle2,
    bgColor: "--neeto-editor-success-100",
  },
];
