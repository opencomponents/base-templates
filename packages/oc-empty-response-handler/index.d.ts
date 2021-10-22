type Callback<T = unknown> = (err: Error | null, data: T) => void;

declare const emptyResponseHandler: {
  contextDecorator: (cb: Callback) => () => void;
  shouldRenderAsEmpty: (model: any) => boolean;
  viewModelEmptyKey: string;
};

export = emptyResponseHandler;
