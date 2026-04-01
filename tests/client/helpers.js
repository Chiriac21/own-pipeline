const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', {name: 'Create new blog'}).click()

    await page.getByLabel('title').fill(title);
    await page.getByLabel('author').fill(author);
    await page.getByLabel('url').fill(url);

    await page.getByRole('button', {name: 'Create'}).click()

    await page.locator('#visible').getByText(title + ' ' + author).waitFor()
}

const loginWith = async (page, username, password) => {
    await page.getByLabel('username').fill(username);
    await page.getByLabel('password').fill(password);
    await page.getByRole('button', {name: 'login'}).click()
}

export {createBlog, loginWith}