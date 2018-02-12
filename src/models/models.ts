export namespace DoznIonic {
  export interface SelectOption {
    name: string;
    id: string;
    type: string;
  }

  export interface ItemOption {
    name: string;
    id: string;
  }

  export interface CreateOption {
    name: string;
    type: string;
  }

  export interface SessionOptions {
    user: string;
    feature: string;
    flow: string;
  }
};
