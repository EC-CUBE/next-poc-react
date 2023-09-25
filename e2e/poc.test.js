import { test, expect } from '@playwright/test';

const crypto = require("crypto");

const CLIENT_URL = 'http://localhost:3000';
const MAILCATCHER_URL = 'http://localhost:1080';

test('pocのシナリオをテストする', async ({ page }) => {
    await page.goto(CLIENT_URL);

    const params = {
        'email': 'ec-cube+' + crypto.randomBytes(3).toString('hex') + '@example.com',
        'password': 'password.1234'
    }

    // 会員登録
    await entry(page, params)

    // 本会員登録
    await entry_activate(page, params);

    // ログイン
    await login(page, params)

    // 購入フロー
    await purchase(page, params)

    // ログアウト
    await logout(page)

    // 404
    await not_found(page, params)
});

async function entry(page, params) {
    // 会員登録画面を表示
    await page.locator('text=登録').click()
    await expect(page.url()).toBe(CLIENT_URL + '/entry');
    // 入力
    await page.getByLabel('名前「姓」 *').fill('足立');
    await page.getByLabel('名前「名」 *').fill('智広');
    await page.getByLabel('フリガナ「セイ」 *').fill('あだち');
    await page.getByLabel('フリガナ「メイ」 *').fill('ちひろ');
    await page.getByTestId('address_pref').click();
    await page.getByRole('option', { name: '北海道' }).click();
    await page.getByLabel('郵便番号 *').fill('0001111');
    await page.getByLabel('住所「市区町村名」 *').fill('住所1');
    await page.getByLabel('住所「番地・ビル名」 *').fill('住所2');
    await page.getByLabel('電話番号 *').fill('00011112222');
    await page.getByLabel('メールアドレス *').fill(params.email);
    await page.getByLabel('パスワード *').fill(params.password);
    // 送信
    await page.getByRole('button', { name: '送信' }).click();
    const thanks = await page.getByText('仮会員登録は完了しています。');
    await expect(thanks).toBeVisible();
    await expect(page.url()).toBe(CLIENT_URL + '/entry/complete');
}

async function entry_activate(page, params) {
    // mailcatcherから最後のメッセージを取得
    const messagesResp = await fetch(MAILCATCHER_URL + '/messages');
    const messages = await messagesResp.json();
    const id = messages.pop().id;

    // mail bodyから本会員登録用URLを取得
    const bodyResp = await fetch(MAILCATCHER_URL + '/messages/' + id + '.plain');
    const body = await bodyResp.text();
    const activate_url = body.match(/http.+/)[0]

    // 本会員登録用URLを表示
    await page.goto(activate_url);
    const thanks = await page.getByText('会員登録ありがとうございます');
    await expect(thanks).toBeVisible();

    // ec-cube clientへ戻る
    await page.goto(CLIENT_URL);
}

async function login(page, params) {
    await page.getByRole('link', {name: 'ログイン'}).getByRole('button').click();
    await expect(page.url()).toBe(CLIENT_URL + '/mypage/login');

    let token = await page.locator('text=現在のセッショントークン');
    await expect(token).toContainText('未ログイン');

    await page.getByLabel('ユーザー名 *').fill(params.email);
    await page.getByLabel('パスワード *').fill(params.password);
    await page.getByRole('button', {name: '送信'}).click();

    token = await page.locator('text=現在のセッショントークン');
    await expect(token).not.toContainText('未ログイン');
}

/**
 * ログアウト機能のテスト
 * @param page
 * @returns {Promise<void>}
 */
async function logout(page) { 
    // ログイン画面へ遷移する
    await page.getByRole('link', {name: 'ログイン'}).getByRole('button').click();
    await expect(page.url()).toBe(CLIENT_URL + '/mypage/login');
    
    // ログアウトボタンをクリック
    await page.getByRole('button', {name: 'ログアウト'}).click();
    const token = await page.locator('text=現在のセッショントークン');
    
    // 未ログインになっていることを確認
    await expect(token).toContainText('未ログイン');
    
    // oAuthCredentialsが削除されていることを確認
    const JWTSessionKey = await page.evaluate(() => JSON.stringify(window.localStorage.getItem('oAuthCredentials')));
    // https://stackoverflow.com/a/41813719 によると、null結果があっても、toBeFlasy()は成功しない
    expect(JWTSessionKey).toBe("null");
}

async function purchase(page, params) {
    // 商品詳細を表示
    await page.getByRole('button', { name: '購入' }).click();
    await expect(page.url()).toBe(CLIENT_URL + '/product/detail/2');
    await page.getByText("チェリーアイスサンド");
    // カートに入れる
    await page.getByRole('button', { name: 'カートに追加' }).click();
    // カートアイコンをクリック
    await page.getByLabel('account of current user').click();
    // カート表示
    await page.getByRole('button', { name: 'カートを見る' }).click();
    await expect(page.url()).toBe(CLIENT_URL + '/cart');
    await page.getByTestId('CloseIcon').locator('path').click(); // サイドバーをクローズ
    // 注文画面へ
    await page.getByRole('button', { name: 'レジへ進む' }).click();
    await expect(page.url()).toBe(CLIENT_URL + '/shopping');
    // 支払い方法を変更
    await page.getByText('お支払い情報').waitFor({state: "visible"});
    const paymentInput = await page.getByText('代金引換');
    await expect(paymentInput).toBeVisible();
    await page.waitForTimeout(1000); // 支払い方法のクリックが検知されないため少しだけ待機
    await paymentInput.click();
    // 確認画面へ
    await page.getByRole('button', { name: '確認する' }).click();
    await expect(page.url()).toBe(CLIENT_URL + '/shopping/confirm');
    const paymentConfirm = await page.getByText('代金引換');
    await expect(paymentConfirm).toBeVisible();
    // 注文完了
    await page.getByRole('button', { name: '注文する' }).click();
    const thanks = await page.getByText('注文ありがとうございます。');
    await expect(thanks).toBeVisible();
    await expect(page.url()).toBe(CLIENT_URL + '/shopping/complete');
}

async function not_found(page, params) {
    await page.goto(CLIENT_URL + '/product/detail/999')
    const not_found = await page.getByText('404');
    await expect(not_found).toBeVisible();
}
