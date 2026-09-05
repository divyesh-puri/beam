import { describe, expect, it } from "vitest";
import { threadScope } from "../src/thread-event-scope.js";
import type { ThreadEvent } from "../src/provider-event.js";
import {
  BB_THREAD_NAME_TAG,
  fromProviderExternalThreadName,
  normalizeProviderThreadNameEvent,
  tagThreadName,
  toProviderExternalThreadName,
} from "../src/thread-name-tags.js";

describe("thread name tags", () => {
  it("round-trips user-provided literal legacy-prefixed titles", () => {
    const providerName = toProviderExternalThreadName("[bb] Literal");

    expect(providerName).toBe("[beam] [bb] Literal");
    expect(fromProviderExternalThreadName(providerName)).toBe("[bb] Literal");
  });

  it("normalizes provider title events by stripping one Beam tag", () => {
    const event = {
      type: "thread/name/updated",
      threadId: "t1",
      providerThreadId: "p1",
      scope: threadScope(),
      threadName: tagThreadName({
        name: "[beam] Literal",
        tag: BB_THREAD_NAME_TAG,
      }),
    } satisfies ThreadEvent;

    expect(normalizeProviderThreadNameEvent(event)).toEqual({
      ...event,
      threadName: "[beam] Literal",
    });
  });

  it("strips the legacy BB tag from existing provider thread names", () => {
    expect(fromProviderExternalThreadName("[bb] Existing thread")).toBe(
      "Existing thread",
    );
  });
});
