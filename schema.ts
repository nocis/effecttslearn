import * as S from "@effect/schema/Schema";

const StringPairsFromStrings = S.array(S.string).pipe(
  S.filter((arr) => arr.every((s) => s.split(": ").length === 2)),
  S.transform(
    S.array(S.tuple(S.string, S.string)),
    (arr) =>
      arr.map((s) => s.split(": ") as unknown as readonly [string, string]),
    (arr) => arr.map((s) => s.join(": "))
  )
);

export const HashMapFromStrings = S.compose(
  StringPairsFromStrings,
  S.hashMap(S.string, S.string)
);

// const testInput = [
//   "Content-Type: application/json",
//   "Content-Length: 42",
// ] as const;

// const parseResult = S.decodeUnknownSync(HashMapFromStrings)(testInput);
// const encodeResult = S.encodeSync(HashMapFromStrings)(parseResult);

// console.log(parseResult);
// console.log(encodeResult);
