import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_CONTENT, validateContent } from "../lib/admin/types";

test("all twelve current service cards can be saved without losing content", () => {
  const result = validateContent(structuredClone(DEFAULT_CONTENT));
  assert.equal(result.services.length, 12);
  assert.equal(result.services.filter(s => s.group === "love").length, 7);
  assert.equal(result.services.filter(s => s.visible).length, 12);
  assert.deepEqual(result, DEFAULT_CONTENT);
});

test("rejects script, data, insecure and credential-bearing image URLs", () => {
  for (const img of ["javascript:alert(1)", "data:image/svg+xml,test", "http://example.com/a.jpg", "//example.com/a.jpg", "https://user:password@example.com/a.jpg", "/assets/img/../../secret", "/api/media/services.json"]) {
    const value = structuredClone(DEFAULT_CONTENT);
    value.services[0].img = img;
    assert.throws(() => validateContent(value), img);
  }
});

test("accepts uploaded media and HTTPS image URLs", () => {
  for (const img of ["/api/media/3d5807a3-c959-4e38-812b-8c11cfffc163.webp", "https://example.com/image.webp"]) {
    const value = structuredClone(DEFAULT_CONTENT);
    value.services[0].img = img;
    assert.equal(validateContent(value).services[0].img, img);
  }
});

test("rejects duplicate IDs, invalid categories, invalid visibility and malformed records", () => {
  const badValues: unknown[] = [null, {}, { services: [null] }];
  for (const mutate of [
    (value: any) => { value.services[1].id = value.services[0].id; },
    (value: any) => { value.services[0].group = "unknown"; },
    (value: any) => { value.services[0].visible = "yes"; },
    (value: any) => { value.services[0].title = " "; },
    (value: any) => { value.services[0].text = "x".repeat(2001); },
    (value: any) => { value.updatedAt = "invalid"; },
    (value: any) => { value.services = Array(61).fill(value.services[0]); },
  ]) {
    const value = structuredClone(DEFAULT_CONTENT); mutate(value); badValues.push(value);
  }
  for (const value of badValues) assert.throws(() => validateContent(value));
});

test("sanitizes record fields, retains hidden services, and permits an empty published list", () => {
  const value = structuredClone(DEFAULT_CONTENT);
  value.services[0].title = "  Example  ";
  value.services[0].visible = false;
  Object.assign(value.services[0], { role: "admin", unknownField: true });
  const result = validateContent(value);
  assert.equal(result.services[0].title, "Example");
  assert.equal(result.services[0].visible, false);
  assert.equal("role" in result.services[0], false);
  assert.equal(value.services[0].title, "  Example  ");
  assert.deepEqual(validateContent({ services: [], updatedAt: null }), { services: [], updatedAt: null });
});
