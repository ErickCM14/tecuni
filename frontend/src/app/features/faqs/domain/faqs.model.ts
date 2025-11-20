export interface Translation {
  name: string;
  description?: string;
  label?: string;
}

export interface ResponseOption {
  translations: {
    es: Translation;
  };
  order: string;
  value: string;
}

export interface Question {
//   key: number;
  translations: {
    es: Translation;
  };
  questionType: 'multiple_choice' | 'open' | 'boolean';
  responses: ResponseOption[];
}

export interface Faqs {
  code: string;
  icon: string;
  color: string;
  categoryId: string;
  translations: {
    es: {
      name: string;
      description: string;
    };
  };
  questions: Question[];
}
