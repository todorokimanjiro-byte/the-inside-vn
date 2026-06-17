export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  subtitle: string;
  subtitleEn?: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  description: string;
  descriptionEn?: string;
  ingredients: string[];
  ingredientsEn?: string[];
  benefits: string[];
  benefitsEn?: string[];
  howToUse: string;
  howToUseEn?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  image: string;
  date: string;
  dateEn?: string;
  readingTime: string;
  readingTimeEn?: string;
}

export interface IngredientStory {
  id: string;
  name: string;
  nameEn?: string;
  image: string;
  accentColor: string;
  description: string;
  descriptionEn?: string;
  benefit: string;
  benefitEn?: string;
  keyCompound: string;
  keyCompoundEn?: string;
}
