import { test, expect } from '@playwright/test'
import populationResponse from './response/population'
import prefecturesResponse from './response/prefectures'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/v1/prefectures', async (route) => {
    await route.fulfill({ status: 200, json: prefecturesResponse })
  })

  await page.route('*/**/api/v1/population/composition/perYear*', async (route) => {
    await route.fulfill({ status: 200, json: populationResponse })
  })
})

test.describe('表示', () => {
  test('ローディング', async ({ page }) => {
    await page.route('*/**/api/v1/prefectures', async (route) => {
      await delay(1000)
      await route.fulfill({ status: 200, json: prefecturesResponse })
    })
    await page.goto('/')
    await expect(page.getByLabel('loading')).toBeVisible()
  })
  test('ホーム画面', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('都道府県グラフ')
    await expect(page.getByRole('heading', { name: '都道府県グラフ', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: '都道府県', level: 2 })).toBeVisible()
    await expect(page.getByRole('checkbox')).toHaveCount(47)

    const chartCard = page.getByTestId('chart-card')
    await expect(chartCard.getByLabel('表示データ')).toBeVisible()

    const select = chartCard.getByRole('combobox')
    await expect(select).toBeVisible()

    const selectOptions = select.locator('option')
    await expect(selectOptions.nth(0)).toHaveText('総人口')
    await expect(selectOptions.nth(1)).toHaveText('年少人口')
    await expect(selectOptions.nth(2)).toHaveText('生産年齢人口')
    await expect(selectOptions.nth(3)).toHaveText('老年人口')
  })
  test('グラフ操作', async ({ page }) => {
    await page.goto('/')
    const chartCard = page.getByTestId('chart-card')
    await expect(chartCard.getByText('データなし')).toBeVisible()

    const checkboxes = page.getByRole('checkbox')
    await checkboxes.nth(0).click()
    await expect(chartCard.locator('.recharts-line')).toHaveCount(1)
    await checkboxes.nth(1).click()
    await expect(chartCard.locator('.recharts-line')).toHaveCount(2)
    await checkboxes.nth(0).click()
    await expect(chartCard.locator('.recharts-line')).toHaveCount(1)
    await checkboxes.nth(1).click()
    await expect(chartCard.getByText('データなし')).toBeVisible()
  })
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
      json: { message: null },
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
