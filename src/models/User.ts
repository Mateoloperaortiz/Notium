import type Semester from '@/models/Semester.js';

export default class User {
  private email: string;
  private id: string;
  private name: string;
  private semesters: Semester[];

  public constructor(id: string, name: string, email: string, semesters: Semester[] = []) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.semesters = semesters;
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

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getSemesters(): Semester[] {
    return this.semesters;
  }

  public setSemesters(semesters: Semester[]): void {
    this.semesters = semesters;
  }
}
