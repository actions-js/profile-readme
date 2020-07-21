import moment from "moment";
import { Widget } from "../widget";

interface TimestampConfig {
  format: string;
}

export function timestamp(widget: Widget<TimestampConfig>): string {
  return moment().utc().format(widget.config.format ?? undefined);
}
