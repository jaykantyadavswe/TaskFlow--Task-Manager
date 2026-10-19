import test from "node:test";
import assert from "node:assert/strict";
import Task from "../models/Task.js";

test("task schema applies defaults to valid tasks", async () => {
  const task = new Task({ title: "Review project" });

  await task.validate();
  assert.equal(task.status, "pending");
  assert.equal(task.priority, "medium");
  assert.equal(task.category, "General");
  assert.equal(task.dueDate, null);
  assert.equal(task.dueTime, "");
});

test("task schema rejects invalid required and enumerated fields", async () => {
  const task = new Task({
    title: "",
    status: "started",
    priority: "urgent",
    category: "Unlisted",
  });
  await assert.rejects(task.validate(), (error) => {
    assert.ok(error.errors.title);
    assert.ok(error.errors.status);
    assert.ok(error.errors.priority);
    assert.ok(error.errors.category);
    return true;
  });
});

test("task schema enforces title, description, and due-time limits", async () => {
  const task = new Task({
    title: "t".repeat(121),
    description: "d".repeat(1001),
    dueTime: "25:90",
  });
  await assert.rejects(task.validate(), (error) => {
    assert.ok(error.errors.title);
    assert.ok(error.errors.description);
    assert.ok(error.errors.dueTime);
    return true;
  });
});
