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
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Chiriac',
        username: 'admin',
        password: 'admin'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'chiri123', 'password')

      await expect(page.getByText('Signed in as: Chiriac Gabriel')).toBeVisible()
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
    })

    test('a new blog can be liked', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test Url')

      await page.getByRole('link', { name: 'Test Title' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('remove a blog added by the user', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test Url')

      await page.getByRole('link', { name: 'Test Title' }).click()
      await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await Promise.all([
        page.waitForResponse(response =>
          response.request().method() === 'DELETE' &&
          response.url().includes('/api/blogs/') &&
          response.status() === 204
        ),
        page.getByRole('button', { name: 'Remove' }).click()
      ])

      await expect(page.getByRole('link', { name: 'Test Title' })).toHaveCount(0)
    })

    test('only user who created the blog sees remove', async ({ page }) => {
      createBlog(page, 'Test Title', 'Test Author', 'Test Url')

      await expect(page.getByText('Signed in as: Chiriac Gabriel')).toBeVisible()

      await page.getByRole('link', { name: 'Test Title' }).click()
      await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()
      
      await expect(page.getByText('added by Chiriac Gabriel')).toHaveCount(1)

      await expect(
        page.getByText(`a new blog Test Title by Test Author added`)
      ).toHaveCount(0, { timeout: 10000 })
      await page.getByRole('button', { name: 'Logout' }).click()

      await loginWith(page, 'admin', 'admin')
      await expect(page.getByText('Signed in as: Chiriac')).toBeVisible()
      await expect(page.getByText('added by Chiriac Gabriel')).toHaveCount(1)
      await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
    })
  })
})