export class PromotionsEntity {
  id: string;
  type: 'promotion' | 'collection' | 'featured';
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
}
