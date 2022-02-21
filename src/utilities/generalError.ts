export class GeneralError extends Error {
  
  constructor(public message: string, private errors: Array<any> = []) {
    super(message)
  }

  getErrors(): Array<any> {
    return this.errors;
  }
}