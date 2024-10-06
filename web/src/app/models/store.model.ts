export class Store {
  id: number;
  description: string;

  constructor({
    id,
    description,
  }: Store) {
    this.id = id;
    this.description = description;
  }
}
