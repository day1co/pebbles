/* eslint-disable no-var */
// From: https://github.com/Microsoft/TypeScript/blob/2c23bea/src/lib/dom.generated.d.ts
// Why?: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/60038

interface TextDecodeOptions {
  stream?: boolean;
}

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

interface TextEncoderEncodeIntoResult {
  read: number;
  written: number;
}

/**
 * A decoder for a specific method, that is a specific character encoding, like utf-8, iso-8859-2, koi8, cp1261, gbk, etc. A decoder takes a stream of bytes as input and emits a stream of code points. For a more scalable, non-native library, see StringView – a C-like representation of strings based on typed arrays.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder)
 */
interface TextDecoder extends TextDecoderCommon {
  /**
   * Returns the result of running encoding's decoder. The method can be invoked zero or more times with options's stream set to true, and then once without options's stream (or set to false), to process a fragmented input. If the invocation without options's stream (or set to false) has no input, it's clearest to omit both arguments.
   *
   * ```
   * var string = "", decoder = new TextDecoder(encoding), buffer;
   * while(buffer = next_chunk()) {
   *   string += decoder.decode(buffer, {stream:true});
   * }
   * string += decoder.decode(); // end-of-queue
   * ```
   *
   * If the error mode is "fatal" and encoding's decoder returns error, throws a TypeError.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/decode)
   */
  decode(input?: AllowSharedBufferSource, options?: TextDecodeOptions): string;
}

declare var TextDecoder: {
  prototype: TextDecoder;
  new (label?: string, options?: TextDecoderOptions): TextDecoder;
};

interface TextDecoderCommon {
  /**
   * Returns encoding's name, lowercased.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/encoding)
   */
  readonly encoding: string;
  /**
   * Returns true if error mode is "fatal", otherwise false.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/fatal)
   */
  readonly fatal: boolean;
  /**
   * Returns the value of ignore BOM.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/ignoreBOM)
   */
  readonly ignoreBOM: boolean;
}

/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoderStream) */
interface TextDecoderStream extends GenericTransformStream, TextDecoderCommon {
  readonly readable: ReadableStream<string>;
  readonly writable: WritableStream<BufferSource>;
}

declare var TextDecoderStream: {
  prototype: TextDecoderStream;
  new (label?: string, options?: TextDecoderOptions): TextDecoderStream;
};

/**
 * TextEncoder takes a stream of code points as input and emits a stream of bytes. For a more scalable, non-native library, see StringView – a C-like representation of strings based on typed arrays.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder)
 */
interface TextEncoder extends TextEncoderCommon {
  /**
   * Returns the result of running UTF-8's encoder.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encode)
   */
  encode(input?: string): Uint8Array;
  /**
   * Runs the UTF-8 encoder on source, stores the result of that operation into destination, and returns the progress made as an object wherein read is the number of converted code units of source and written is the number of bytes modified in destination.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encodeInto)
   */
  encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult;
}

declare var TextEncoder: {
  prototype: TextEncoder;
  new (): TextEncoder;
};

interface TextEncoderCommon {
  /**
   * Returns "utf-8".
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encoding)
   */
  readonly encoding: string;
}

/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoderStream) */
interface TextEncoderStream extends GenericTransformStream, TextEncoderCommon {
  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<string>;
}

declare var TextEncoderStream: {
  prototype: TextEncoderStream;
  new (): TextEncoderStream;
};
