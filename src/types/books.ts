export interface BooksResponse {
  kind: string;
  totalItems: number;
  items: BookItem[];
}

export interface BookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo?: SearchInfo;
}

export interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate: string;
  description: string;
  industryIdentifiers: IndustryIdentifier[];
  readingModes: ReadingModes;
  pageCount: number;
  printType: string;
  categories: string[];
  averageRating?: number;
  ratingsCount?: number;
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: PanelizationSummary;
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

export interface ReadingModes {
  text: boolean;
  image: boolean;
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice?: Price;
  retailPrice?: Price;
  buyLink?: string;
  offers?: Offer[];
}

export interface Price {
  amount: number;
  currencyCode: string;
}

export interface Offer {
  finskyOfferType: number;
  listPrice: Price;
  retailPrice: Price;
}

export interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: DownloadInfo;
  pdf: DownloadInfo;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

export interface DownloadInfo {
  isAvailable: boolean;
  acsTokenLink?: string;
}

export interface SearchInfo {
  textSnippet: string;
}

export const Ratings = [
  {
    value: 5,
    label: '5 — I love it!',
  },
  {
    value: 4,
    label: '4 — I like it!',
  },
  {
    value: 3,
    label: "3 — It's okay!",
  },
  {
    value: 2,
    label: "2 — I don't like it!",
  },
  {
    value: 1,
    label: '1 — I hate it!',
  },
] as const;

export const RatingParams = ['5', '4', '3', '2', '1'] as const;

export type RatingNumbers = (typeof Ratings)[number]['value'];
