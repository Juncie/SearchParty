import { describe, expect, it } from "vitest";

import { canTransitionApplicationStatus } from "../index";

describe("canTransitionApplicationStatus", () => {
  it("allows saved to started/applied", () => {
    expect(canTransitionApplicationStatus("saved", "started")).toBe(true);
    expect(canTransitionApplicationStatus("saved", "applied")).toBe(true);
  });

  it("rejects applied to saved", () => {
    expect(canTransitionApplicationStatus("applied", "saved")).toBe(false);
  });

  it("allows same-status no-op", () => {
    expect(canTransitionApplicationStatus("interviewing", "interviewing")).toBe(
      true,
    );
  });
});
