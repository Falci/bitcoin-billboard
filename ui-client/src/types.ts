export interface BoardMessage {
  author?: string;
  link?: string;
  message: string;
}

export interface FormType extends BoardMessage {}
