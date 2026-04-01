const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helpers')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
    data: {
        name: 'Chiriac Gabriel',
        username: 'chiri123',
        password: 'password'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'chiri123', 'password')

      await expect(page.getByText('Chiriac Gabriel logged in.')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'chiri123', 'wrong')

      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'chiri123', 'password')
  })

  test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'Test Title', 'Test Author', 'Test Url')

    await expect(page.getByText('a new blog Test Title by Test Author added')).toBeVisible()
    await expect(page.getByText('Test Title Test Author')).toBeVisible()
    await expect(page.getByRole('button', {name: 'View'})).toBeVisible()
    await expect(page.getByRole('button', {name: 'Remove'})).toBeVisible()
  })

  test('a new blog can be liked', async ({ page }) => {
    await createBlog(page, 'Test Title', 'Test Author', 'Test Url')

    await page.getByRole('button', {name: 'View'}).click()
    await page.getByRole('button', {name: 'like'}).click()

    await expect(page.getByText('likes 1')).toBeVisible()
  })

  test('remove a blog added by the user', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept())

    await createBlog(page, 'Test Title', 'Test Author', 'Test Url')

    await expect(page.getByRole('button', {name: 'Remove'})).toBeVisible()
    
    await page.getByRole('button', {name: 'Remove'}).click()

    await expect(page.getByText('Test Title Test Author')).not.toBeVisible()
    await expect(page.getByRole('button', {name: 'View'})).not.toBeVisible()
    await expect(page.getByRole('button', {name: 'Remove'})).not.toBeVisible()

  })

  test('only user who created the blog sees remove', async ({ page }) => {
    createBlog(page, 'Test Title', 'Test Author', 'Test Url')

    await expect(page.getByRole('button', {name: 'Remove'})).toBeVisible()

    await page.getByRole('button', {name: 'View'}).click()

    await expect(page.getByText('Chiriac Gabriel logged in.')).toBeVisible()
    await expect(page.locator('#hidden').getByText('Chiriac Gabriel')).toBeVisible()
  })

  test('blogs order according to the likes', async ({ page }) => {
    await createBlog(page, 'Test Title', 'Test Author', 'Test Url')
    await createBlog(page, 'Test Title2', 'Test Author', 'Test Url2')

    const blogs = page.locator('[data-testid="blog"]')

    await blogs.nth(1).getByRole('button', {name: 'View'}).click()
    await blogs.nth(1).getByRole('button', {name: 'like'}).click()

    const blogsAfter = page.locator('[data-testid="blog"]')

    blogsAfter.nth(0).getByRole('button', {name: 'View'}).click()

    await expect(blogsAfter.nth(0).getByText('likes 1')).toBeVisible()
    await expect(blogsAfter.nth(1).getByText('likes 0')).toBeVisible()
  })
})
})