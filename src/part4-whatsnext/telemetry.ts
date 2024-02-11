import { Effect } from "effect";
import { NodeSdk } from "@effect/opentelemetry";
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
// Effect has first class support for OpenTelemetry
// Through annotating our code with 'span's and emitting events
// Effect, provides the data necessary to create traces and metrics that give us huge insight into our applications

// Effect's composable nature is actually a perfect fit for this
// Normally you have to manually create, enter, and exit spans
// and think about try / catch / finally blocks to ensure that spans are closed and errors are properly handled

// This data can be used with programs like Prometheus and Grafana to
// monitor and visualize the performance of our applications

// but for these examples we will just use the console

const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}));

// Effect.runPromise(instrumented.pipe(Effect.provide(NodeSdkLive)));
const runLogTelemetry = (effect: Effect.Effect<void>) =>
  Effect.runPromise(effect.pipe(Effect.provide(NodeSdkLive)));

// With effect its literally one line to add a span

const effect = Effect.unit.pipe(Effect.withSpan("my-span"));

// runLogTelemetry(effect);

// attributes can be added to the span

const effect2 = Effect.unit.pipe(
  Effect.withSpan("my-span", { attributes: { key: "value" } })
);

// runLogTelemetry(effect2);

// to annotate the current span

const effect3 = Effect.unit.pipe(
  Effect.tap(() => Effect.annotateCurrentSpan("key", "value")),
  Effect.withSpan("my-span")
);

// runLogTelemetry(effect3);

// logs are automatically emitted as events

const effect4 = Effect.log("my-log").pipe(Effect.withSpan("my-span"));

// runLogTelemetry(effect4);

// nesting spans is also easy

const effect5 = Effect.unit.pipe(
  Effect.withSpan("child-span"),
  Effect.withSpan("parent-span")
);

runLogTelemetry(effect5);
