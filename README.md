<h1 align="center">
    <a href="https://scv.laoplus.net/">SCV</a>
</h1>
<p align="center">
    <a href="https://scv.laoplus.net/">scv.laoplus.net</a>
<p>

<p align="center">Scenario and Scene Viewer Website for Last Origin.</p>

<p align="center">
    <a href="https://discord.gg/Z6XSqZn6Zj">
        <img src="https://img.shields.io/discord/913406465312690217.svg?label=&logo=discord&logoColor=ffffff&color=5865F2&labelColor=5865F2&style=flat-square" alt="Discord" />
    </a>
</p>

## development

### data

SCV をビルドするには `/data` にデータが必要です。

実際のデータを GitHub 上で公開するのは気がひけるので、別のプライベートリポジトリで管理しています。

~~実データと同じ構造のダミーデータを https://github.com/laoplus/lo-data-dummy で公開しています。~~

使用するデータが開発当初考えていたものよりかなり膨らんでしまったため、まだダミーデータの準備ができていません。現状でいじりたい方は型からの雰囲気で修正してください……。

ビルドするにはローカルに clone した実データあるいはダミーデータへのパスを、`/data` から参照できるようにシンボリックリンクを貼ってください。

```cmd
; Windows での例
mklink /d C:\Users\Eai\ghq\github.com\laoplus\scv\data C:\Users\Eai\ghq\github.com\laoplus\lo-data
```

### アイコンライブラリ

[`unplugin-icons`](https://github.com/antfu/unplugin-icons)を使っています。

オンデマンドに作成される影響で IntelliSense などの補完が出ないので、アイコンを追加する際は https://icones.js.org/ からアイコンを選んで、キャメルケースの名前をコピーして貼るといいと思います。

![image](https://user-images.githubusercontent.com/3516343/179745714-764b45c6-d934-439c-bafc-173f5e4cb697.png)

[`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import)を使っているため明示的な import は不要です。`auto-import.ts` は git から ignore しています。`yarn dev`でページを開いた時に作成されるはずです。

Octicon 以外のアイコンコレクションを使う際は `vite.config.ts` の `enabledCollections` をいじってください。
