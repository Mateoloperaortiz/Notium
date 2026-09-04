import type Grade from '@/models/Grade.js';

export default class Subject {
  private credits: number;
  private grades: Grade[];
  private id: string;
  private name: string;

  public constructor(id: string, name: string, credits: number, grades: Grade[] = []) {
    this.id = id;
    this.name = name;
    this.credits = credits;
    this.grades = grades;
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

  public getCredits(): number {
    return this.credits;
  }

  public setCredits(credits: number): void {
    this.credits = credits;
  }

  public getGrades(): Grade[] {
    return this.grades;
  }

  public setGrades(grades: Grade[]): void {
    this.grades = grades;
  }
}
