export default class Grade {
  private id: string;
  private name: string;
  private percentage: number;
  private value: number;

  public constructor(id: string, name: string, value: number, percentage: number) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.percentage = percentage;
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getValue(): number {
    return this.value;
  }

  public setValue(value: number): void {
    this.value = value;
  }

  public getPercentage(): number {
    return this.percentage;
  }

  public setPercentage(percentage: number): void {
    this.percentage = percentage;
  }
}
