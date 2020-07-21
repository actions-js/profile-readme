import moment from "moment-timezone";
import { Widget } from "../widget";

interface TimestampConfig {
  format: string; // moment format
  tz: string; // moment tz
}

export function timestamp(widget: Widget<TimestampConfig>): string {
  const now = moment();
  if (widget.config.tz) {
    return now.tz(widget.config.tz).format(widget.config.format ?? undefined);
  }
  return now.utc().format(widget.config.format ?? undefined);
}
