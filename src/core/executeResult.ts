export class ExecuteResult {
  message: string;
  constructor(msg: string) {
    this.message = msg;
  }
};

export class SuccessResult extends ExecuteResult{

}

export class FailureResult extends ExecuteResult{

}

export class Failure extends Error{

}

export class TextParseError extends  Error{

}

export class NeedRepeatFailure extends Failure{
  repeatSeconds: number;
  constructor(error: string, repeatSeconds: number) {
    super(error);
    this.repeatSeconds =repeatSeconds;
  }
}