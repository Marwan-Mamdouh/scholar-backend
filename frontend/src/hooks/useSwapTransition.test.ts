import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSwapTransition } from "./useSwapTransition";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useSwapTransition", () => {
  it("keeps the old value while leaving, then swaps after exitMs", () => {
    const { result, rerender } = renderHook(({ target }) => useSwapTransition(target, 200), {
      initialProps: { target: "grid" as string | number },
    });
    expect(result.current).toEqual({ shown: "grid", leaving: false });

    rerender({ target: 7 });
    expect(result.current).toEqual({ shown: "grid", leaving: true });

    act(() => vi.advanceTimersByTime(199));
    expect(result.current.shown).toBe("grid");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toEqual({ shown: 7, leaving: false });
  });

  it("settles on the latest target when re-targeted mid-exit", () => {
    const { result, rerender } = renderHook(({ target }) => useSwapTransition(target, 200), {
      initialProps: { target: null as number | null },
    });

    rerender({ target: 1 });
    act(() => vi.advanceTimersByTime(100));
    rerender({ target: 2 });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current.shown).toBeNull();

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toEqual({ shown: 2, leaving: false });
  });

  it("cancels the exit when the target returns to the shown value", () => {
    const { result, rerender } = renderHook(({ target }) => useSwapTransition(target, 200), {
      initialProps: { target: null as number | null },
    });

    rerender({ target: 1 });
    rerender({ target: null });
    expect(result.current.leaving).toBe(false);

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toEqual({ shown: null, leaving: false });
  });
});
