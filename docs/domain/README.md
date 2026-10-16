# ドメインモデル

ドメインモデルをパッケージごとのフォルダに記述します。パッケージ内の集約俯瞰図は各パッケージの README に、パッケージをまたぐ関係はこのドキュメントにあります。図の記法は [rules/model-design](../../rules/model-design/standard.md)、図と実装の対応は `npm run check:model-trace` が機械で突き合わせます（フォルダ名が `uld.config.json` の `domainSources` に対応します）。

- [ユビキタス言語](ubiquitous-language.md) — ドメイン用語の定義（パッケージ横断）

## パッケージ一覧

| パッケージ | 内容 |
| --- | --- |
| [janken](janken/README.md) | じゃんけんの手・勝敗判定・戦績・対戦の進行 |

## 保存の大原則

このプロダクトは何も永続化しません。戦績を含むすべての状態はページを開いている間だけメモリに持ち、再読み込みで捨てます（[UC-01](../usecases/UC-01-じゃんけんで対戦する.md)）。そのため Entity と Repository port は無く、ドメインモデルはすべて不変の Value Object です。状態が変わる操作は、新しい Value Object を返します。
