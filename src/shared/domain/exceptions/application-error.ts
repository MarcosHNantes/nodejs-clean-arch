import {StatusCodes} from 'http-status-codes';

export class ApplicationError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly details: any;

  constructor(
      message: string,
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
      details?: any,
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}
