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
  constructor(message: string) {
    super(message);
    this.name = "Failure";
  }
}

export class TextParseError extends  Error{

}

export class NoHeroSelectedError extends Failure{
  constructor(message: string) {
    super(message);
    this.name = "NoHeroSelectedError";
  }
}
export class TodayTaskNotRequiredFailure extends Failure{
  constructor(message: string) {
    super(message);
    this.name = "TodayTaskNotRequiredFailure";
  }
}

export class NeedRepeatFailure extends Failure{
  repeatSeconds: number;
  constructor(error: string, repeatSeconds: number) {
    super(error);
    this.repeatSeconds =repeatSeconds;
  }
}