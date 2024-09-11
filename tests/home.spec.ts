import { test, expect } from '@playwright/test'
import populationResponse from './response/population'
import prefecturesResponse from './response/prefectures'

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/v1/prefectures', async (route) => {
    await route.fulfill({ status: 200, json: prefecturesResponse })
  })

  await page.route('*/**/api/v1/population/composition/perYear*', async (route) => {
    await route.fulfill({ status: 200, json: populationResponse })
  })
})

test('初期表示', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('都道府県グラフ')
  await expect(page.getByText('北海道')).toBeVisible()
})

test.describe('エラー', () => {
  test.describe('400 Bad Request', () => {
    const response = { status: 200, body: '400' }
    test('/api/v1/prefectures', async ({ page }) => {
      await page.route('*/**/api/v1/prefectures', async (route) => {
        await route.fulfill(response)
      })
      await page.goto('/')
      await expect(page.getByText('エラー')).toBeVisible()
    })
    test('/api/v1/population/composition/perYear', async ({ page }) => {
      await page.route('*/**/api/v1/population/composition/perYear*', async (route) => {
        await route.fulfill(response)
      })
      await page.goto('/')
      await page.getByText('北海道').click()
      await expect(page.getByText('エラー')).toBeVisible()
    })
  })
  test.describe('403 Forbidden', () => {
    const response = {
      status: 200,
      json: {
        statusCode: '403',
        message: 'Forbidden.',
        description: '',
      },
    }
    test('/api/v1/prefectures', async ({ page }) => {
      await page.route('*/**/api/v1/prefectures', async (route) => {
        await route.fulfill(response)
      })
      await page.goto('/')
      await expect(page.getByText('エラー')).toBeVisible()
    })
    test('/api/v1/population/composition/perYear', async ({ page }) => {
      await page.route('*/**/api/v1/population/composition/perYear*', async (route) => {
        await route.fulfill(response)
      })
      await page.goto('/')
      await page.getByText('北海道').click()
      await expect(page.getByText('エラー')).toBeVisible()
    })
  })
  test.describe('404 Not Found', () => {
    test.describe('string', () => {
      const response = { status: 200, body: '404' }
      test('/api/v1/prefectures', async ({ page }) => {
        await page.route('*/**/api/v1/prefectures', async (route) => {
          await route.fulfill(response)
        })
        await page.goto('/')
        await expect(page.getByText('エラー')).toBeVisible()
      })
      test('/api/v1/population/composition/perYear', async ({ page }) => {
        await page.route('*/**/api/v1/population/composition/perYear*', async (route) => {
          await route.fulfill(response)
        })
        await page.goto('/')
        await page.getByText('北海道').click()
        await expect(page.getByText('エラー')).toBeVisible()
      })
    })
    test.describe('object', () => {
      const response = {
        status: 200,
        json: {
          statusCode: '404',
          message: "404. That's an error.",
          description: 'The requested URL /404 was not found on this server.',
        },
      }
      test('/api/v1/prefectures', async ({ page }) => {
        await page.route('*/**/api/v1/prefectures', async (route) => {
          await route.fulfill(response)
        })
        await page.goto('/')
        await expect(page.getByText('エラー')).toBeVisible()
      })
      test('/api/v1/population/composition/perYear', async ({ page }) => {
        await page.route('*/**/api/v1/population/composition/perYear*', async (route) => {
          await route.fulfill(response)
        })
        await page.goto('/')
        await page.getByText('北海道').click()
        await expect(page.getByText('エラー')).toBeVisible()
      })
    })
  })
  test.describe('429 Too Many Requests', () => {
    const response = {
      status: 429,
      json: {
        message: null,
      },
    }
    test('/api/v1/prefectures', async ({ page }) => {
      await page.route('*/**/api/v1/prefectures', async (route) => {
        await route.fulfill(response)
      })
      await page.goto('/')
      await expect(page.getByText('エラー')).toBeVisible()
    })
    test('/api/v1/population/composition/perYear', async ({ page }) => {
      await page.route('*/**/api/v1/population/composition/perYear*', async (route) => {
        await route.fulfill(response)
      })
      await page.goto('/')
      await page.getByText('北海道').click()
      await expect(page.getByText('エラー')).toBeVisible()
    })
  })
})
