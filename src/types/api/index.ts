export type Annotations = {
  bold: boolean;
  code: boolean;
  italic: boolean;
  color: string;
  strikethrough: boolean;
  underline: boolean;
  href?: string;
  equation?: boolean;
};

export type RichText = {
  plainText: string;
  annotations: Annotations;
};

export type DateRange = {
  start: Date;
  end?: Date;
};

export type PostMetadata = {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  date?: Date;
  authors: string[];
  image?: string;
  featured: boolean;
  description: RichText[];
};
