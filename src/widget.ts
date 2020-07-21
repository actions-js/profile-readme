export interface Widget<T> {
  config: Partial<T>;
  matched: string;
}

export function widgets<T>(
  name: string,
  source: string
): Widget<T>[] | undefined {
  const comment = `<!--\s*${name}(?::({.*}))?\s*-->`;
  const regex = new RegExp(comment, "g");
  const widgets: Widget<T>[] = [];

  let res: RegExpExecArray | null;
  while ((res = regex.exec(source)) !== null) {
    const widget: Widget<T> = {
      matched: res[0],
      config: {}
    };
    try {
      if (res[1]) widget.config = JSON.parse(res[1]) as T;
    } catch (error) {}
    widgets.push(widget);
  }

  if (widgets.length === 0) return undefined;
  return widgets;
}
