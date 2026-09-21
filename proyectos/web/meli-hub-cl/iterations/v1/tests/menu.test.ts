import { describe, expect, it } from "vitest";
import { normalizeMenuItem } from "../src/meli/products";

const mockEnv = {
  MELI_SITE_ID: "MLC",
  MELI_CURRENCY_ID: "CLP",
} as import("../src/env").Env;

describe("menu upload", () => {
  it("normalizes menu item with family_name and defaults", () => {
    const item = normalizeMenuItem(
      {
        family_name: "Empanada de pino",
        category_id: "MLC1417",
        price: 2500,
        available_quantity: 5,
        condition: "new",
      },
      mockEnv
    );
    expect(item.family_name).toBe("Empanada de pino");
    expect(item.category_id).toBe("MLC1417");
    expect(item.pictures?.length).toBeGreaterThan(0);
    expect(item.attributes?.length).toBeGreaterThan(0);
  });
});
