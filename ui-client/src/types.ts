export interface BoardMessage {
  author?: string;
  link?: string;
  message: string;
}

export interface AddrSignature {
  address: string;
  message: string;
  signature: string;
}

export interface FormItem extends Omit<AddrSignature, 'message'> {
  value: number;
  tinted: number;
}
export interface FormType extends BoardMessage {
  items: FormItem[];
}
