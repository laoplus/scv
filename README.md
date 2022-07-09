# SCV

## build

### data

SCV をビルドするには `/data` にデータが必要です。

実際のデータを GitHub 上で公開するのは気がひけるので、別のプライベートリポジトリで管理しています。

実データと同じ構造のダミーデータを https://github.com/laoplus/lo-data-dummy で公開しています。

ビルドするにはローカルに clone した実データあるいはダミーデータへのパスを、`/data` から参照できるようにシンボリックリンクを貼ってください。

```cmd
; Windows での例
mklink /d C:\Users\Eai\ghq\github.com\laoplus\scv\data C:\Users\Eai\ghq\github.com\laoplus\lo-data
```
