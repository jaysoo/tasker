import { expect, test } from '@playwright/test';
import { login } from './helpers/auth-helper';
import { createTask } from './helpers/task-helper';
import { setStatus } from './helpers/project-helper';

test('Projects Tests: Details page', async ({ page }) => {
  const now = Date.now();
  await login(page, { email: 'alice@tasker.io', password: '123456' });
  await page.goto('/dashboard');

  await createTask(page, {
    title: `Engineering task #1 ${now}`,
    description: `Description ${now}`,
    project: 'Engineering',
    assignToMe: true,
  });
  await createTask(page, {
    title: `Engineering task #2 ${now}`,
    description: `Description ${now}`,
    project: 'Engineering',
    assignToMe: true,
  });
  await createTask(page, {
    title: `Design task #1 ${now}`,
    description: `Description ${now}`,
    project: 'Design',
    assignToMe: false,
  });
  await createTask(page, {
    title: `Design task #2 ${now}`,
    description: `Description ${now}`,
    project: 'Design',
    assignToMe: false,
  });

  // Check details pages for created tasks
  await page.goto('/projects/ENG');

  let taskItemTextContents = await page
    .locator('[data-testid=task-item]')
    .allTextContents();

  expect(
    taskItemTextContents.some((s) => s.match(`Engineering task #1 ${now}`)),
  ).toBeTruthy();
  expect(
    taskItemTextContents.some((s) => s.match(`Engineering task #2 ${now}`)),
  ).toBeTruthy();

  await page.goto('/projects/UX');

  taskItemTextContents = await page
    .locator('[data-testid=task-item]')
    .allTextContents();

  expect(
    taskItemTextContents.some((s) => s.match(`Design task #1 ${now}`)),
  ).toBeTruthy();
  expect(
    taskItemTextContents.some((s) => s.match(`Design task #2 ${now}`)),
  ).toBeTruthy();
});

test('Projects Tests: Update project status', async ({ page }) => {
  await login(page, { email: 'alice@tasker.io', password: '123456' });
  await page.goto('/projects/UX');

  await setStatus(page, 'at_risk');

  await page.waitForTimeout(10_000);
  await page.reload();

  expect(
    await page.locator('[data-testid=project-input-status]').inputValue(),
  ).toEqual('at_risk');

  await setStatus(page, 'off_track');

  await page.waitForTimeout(10_000);
  await page.reload();

  expect(
    await page.locator('[data-testid=project-input-status]').inputValue(),
  ).toEqual('off_track');

  await setStatus(page, 'on_track');

  await page.waitForTimeout(10_000);
  await page.reload();

  expect(
    await page.locator('[data-testid=project-input-status]').inputValue(),
  ).toEqual('on_track');

  // Checking another project
  await page.goto('/projects/ENG');
  // Other project has default status
  expect(
    await page.locator('[data-testid=project-input-status]').inputValue(),
  ).toEqual('on_track');

  await setStatus(page, 'off_track');

  await page.waitForTimeout(10_000);
  await page.reload();

  expect(
    await page.locator('[data-testid=project-input-status]').inputValue(),
  ).toEqual('off_track');

  await setStatus(page, 'at_risk');

  await page.waitForTimeout(10_000);
  await page.reload();

  expect(
    await page.locator('[data-testid=project-input-status]').inputValue(),
  ).toEqual('at_risk');

  await setStatus(page, 'on_track');

  await page.waitForTimeout(10_000);
  await page.reload();

  expect(
    await page.locator('[data-testid=project-input-status]').inputValue(),
  ).toEqual('on_track');
});

test('Projects Tests: Create task from details page defaults project to current project', async ({
  page,
}) => {
  const now = Date.now();
  await login(page, { email: 'alice@tasker.io', password: '123456' });

  // Test on UX project
  await page.goto('/projects/UX');

  await createTask(page, {
    title: `Design task #1 ${now}`,
    description: `Description`,
    assignToMe: false,
  });
  await createTask(page, {
    title: `Design task #2 ${now}`,
    description: `Description`,
    assignToMe: false,
  });

  let taskItemTextContents = await page
    .locator('[data-testid=task-item]')
    .allTextContents();
  expect(
    taskItemTextContents.some((s) => s.includes(`Design task #1 ${now}`)),
  ).toBeTruthy();
  expect(
    taskItemTextContents.some((s) => s.includes(`Design task #2 ${now}`)),
  ).toBeTruthy();

  // Test on ENG project
  await page.goto('/projects/ENG');

  await createTask(page, {
    title: `Engineering task #1 ${now}`,
    description: `Description`,
    assignToMe: false,
  });
  await createTask(page, {
    title: `Engineering task #2 ${now}`,
    description: `Description`,
    assignToMe: false,
  });

  taskItemTextContents = await page
    .locator('[data-testid=task-item]')
    .allTextContents();
  expect(
    taskItemTextContents.some((s) => s.includes(`Engineering task #1 ${now}`)),
  ).toBeTruthy();
  expect(
    taskItemTextContents.some((s) => s.includes(`Engineering task #2 ${now}`)),
  ).toBeTruthy();
});
