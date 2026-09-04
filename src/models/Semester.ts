import type Subject from '@/models/Subject.js';

export default class Semester {
  private endDate: string;
  private id: string;
  private name: string;
  private startDate: string;
  private subjects: Subject[];

  public constructor(
    id: string,
    name: string,
    startDate: string,
    endDate: string,
    subjects: Subject[] = [],
  ) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.subjects = subjects;
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

  public getStartDate(): string {
    return this.startDate;
  }

  public setStartDate(startDate: string): void {
    this.startDate = startDate;
  }

  public getEndDate(): string {
    return this.endDate;
  }

  public setEndDate(endDate: string): void {
    this.endDate = endDate;
  }

  public getSubjects(): Subject[] {
    return this.subjects;
  }

  public setSubjects(subjects: Subject[]): void {
    this.subjects = subjects;
  }
}
