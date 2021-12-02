export interface Tag {
  text: string;
}

export interface TemplateOpts {
  readonly template: string;
  readonly view: Record<string, unknown>;
  readonly partial?: Record<string, string>;
  readonly customTag?: string[];
}
