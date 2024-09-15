import React, { useEffect, useState } from "react";

import { Heading } from "../components/Heading";
import { cn } from "../components/utils";
import { onBeforeRender } from "./+onBeforeRender";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

function timeAgo(date: Date, now = new Date()): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}ヶ月前`;
  const years = Math.floor(months / 12);
  return `${years}年前`;
}

const FAQItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <details className="w-full bg-white">
      <summary className="cursor-pointer p-4 font-bold">{title}</summary>
      <div className="m-4 mt-0 flex flex-col gap-2 [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </details>
  );
};

const Alerts = ({
  type,
  title,
  children,
}: {
  type: "success" | "error" | "warning" | "info";
  title: string;
  children: React.ReactNode;
}) => {
  const icon = (() => {
    switch (type) {
      case "success":
        return {
          className: "bg-lime-100 text-lime-800",
          element: <OcticonCheckCircle24 />,
        };
      case "error":
        return {
          className: "bg-red-100 text-red-800",
          element: <OcticonCircleSlash24 />,
        };
      case "warning":
        return {
          className: "bg-amber-100 text-amber-800",
          element: <OcticonAlert24 />,
        };
      case "info":
        return {
          className: "bg-blue-100 text-blue-800",
          element: <OcticonInfo24 />,
        };
    }
  })();

  return (
    <div className="m-auto flex max-w-lg overflow-hidden rounded border">
      <div
        className={cn("flex items-center p-2 text-2xl md:p-4", icon.className)}
      >
        {icon.element}
      </div>
      <div className="flex flex-col gap-2 p-2 text-left">
        <h2 className="text-center font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export function Page({ buildDate }: PageProps) {
  const [buildDateAgo, setBuildDateAgo] = useState<string | null>(null);
  useEffect(() => {
    setBuildDateAgo(timeAgo(new Date(buildDate)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="my-12 flex flex-col gap-8 px-2 text-center">
      <div className="flex flex-col gap-4">
        <Heading level={1} className="px-0 py-0">
          SCV
        </Heading>
        <span>SCVは日本版ラストオリジンのシーン・シナリオビューアです</span>
        <time
          dateTime={buildDate}
          title={new Intl.DateTimeFormat("ja-JP", {
            dateStyle: "medium",
            timeStyle: "long",
            timeZone: "Asia/Tokyo",
          }).format(new Date(buildDate))}
        >
          最終更新:&nbsp;
          {buildDateAgo || (
            <div className="inline animate-pulse rounded bg-slate-300 text-transparent">
              0日前
            </div>
          )}
        </time>
      </div>

      <Alerts title="SCVは現在プレリリース状態です" type="warning">
        <p>
          基本的な機能は動作するはずですが、すべては開発中であり最終的な品質ではありません。
          <br />
        </p>
      </Alerts>

      <Alerts
        title="SCVはゲームを既プレイかつ、すべてのシナリオを読み終えているユーザー向けのサービスです"
        type="warning"
      >
        <p>
          キャラクターが表示されない・エフェクトが不完全などの理由で現在のSCVでのシナリオ閲覧体験はゲームより劣っています。最良の体験を得るために1回目はゲーム内で閲覧することを推奨します。
        </p>
        <details className="rounded bg-slate-100">
          <summary className="p-2">シナリオの解放条件について</summary>
          <div className="flex flex-col gap-2 p-2 pt-0 ">
            <p>
              クリア済みステージのシナリオは基地内にある記録物保管所の記録室から閲覧できます。
              <br />
              また、メインシナリオを特定の箇所まで進めることで、未プレイであっても過去のイベントシナリオを閲覧できるようになります。
            </p>
            <p className="text-right">
              <a
                href="https://www.last-origin.com/news_view.html?no=485"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                公式サイトによる解放条件の解説
              </a>
            </p>
          </div>
        </details>
      </Alerts>

      <Alerts title="ご意見をお寄せください" type="info">
        <p>
          体験を向上させるために問題点や改善案を
          <a
            href="https://discord.gg/Z6XSqZn6Zj"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
          にてお寄せください。
          <br />
          あるいは単に感想だけでも開発者のモチベーションに寄与します！
          <br />
          SCVのチャンネルは
          <a
            href="https://discord.com/channels/913406465312690217/994859556599513139"
            className="mx-0.5 rounded bg-gray-200 p-0.5 text-black"
          >
            #📜general
          </a>
          です。
        </p>
        <a
          href="https://discord.gg/Z6XSqZn6Zj"
          className="m-auto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://invidget.switchblade.xyz/Z6XSqZn6Zj"
            className="aspect-[43/11] w-full"
          />
        </a>
      </Alerts>

      <div>
        <Heading
          level={2}
          className="py-12 text-4xl font-extrabold tracking-tight"
        >
          FAQ
        </Heading>
        <div className="m-auto flex max-w-3xl flex-col gap-px overflow-hidden rounded-lg border bg-slate-200 text-left shadow">
          <FAQItem title="誤字を見つけた！">
            <p>
              まず誤字を報告する前に
              <strong>それがゲームのテキストであるか</strong>
              を確認してください。
            </p>
            <ol className="ml-5 flex list-outside list-disc flex-col gap-2">
              <li>
                ゲームのテキストなら:
                <br />
                おそらくその誤字はゲーム内でも表示されているものです。確認して、必要であればゲームの運営に報告してください。ゲームデータが更新されるとSCVにも反映されます。
              </li>
              <li>
                ゲームのテキストでないなら:
                <br /> 報告してください！
              </li>
            </ol>
          </FAQItem>
          <FAQItem title="バグを見つけた！">
            <p>
              <span className="line-through opacity-50">仕様です。</span>
            </p>
            <p>
              <a
                href="https://github.com/laoplus/scv/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc"
                target="_blank"
                rel="noopener noreferrer"
              >
                バグトラッカー
              </a>
              を確認して、同じ報告ながければ報告してください。
            </p>
            <p>現在の既知のバグ</p>
            <ol className="ml-5 flex list-outside list-disc flex-col gap-2">
              <li>
                全文検索の検索結果でアイコンと喋っている人が異なる（今のところ仕様）
              </li>
              <li>
                ブラウザの機能で履歴を戻ったときにスクロール復帰位置がおかしい
              </li>
            </ol>
          </FAQItem>
          <FAQItem title="ゲームで公開されていないテキストがSCVで公開されてるけどいいの？">
            <p>よくないです。最優先で修正するので報告してください。</p>
          </FAQItem>
          <FAQItem title="ゲームが更新されたけどSCVで見れないんだけど？">
            <p>
              SCVは手動でデータを更新したタイミングで更新されます。数分から数日お待ち下さい。
            </p>
          </FAQItem>
          <FAQItem title="ゲーム内のどのシーンが見れる？">
            <p>現在は以下に対応しています。</p>
            <ol className="ml-5 flex list-outside list-disc flex-col gap-2">
              <li>日本版で公開されているメインシナリオのOP, ED, 戦闘内会話</li>
              <li>日本版で開催されたイベントシナリオのOP, ED, 戦闘内会話</li>
            </ol>
            <p>
              チュートリアルや誓約シーンは未対応です。（特に誓約シーンは閲覧のために有償アイテムが絡むため、公開するつもりはありません）
            </p>
          </FAQItem>
          <FAQItem title="SNSなどで共有してもいい？">
            <p>はい、共有しても問題ありません。</p>
            <p>
              ただし、画像やゲームテキストはVALOFE Co., Ltd. & GOP Co.,
              Ltd.の資産です。
            </p>
          </FAQItem>
          <FAQItem title="誰が作った？連絡先は？">
            <p>
              <a
                href="https://github.com/laoplus"
                target="_blank"
                rel="noopener noreferrer"
              >
                LAOPLUS（グループ）
              </a>
              のえあいです。LAOPLUS（グループ）は
              <a
                href="https://github.com/laoplus/laoplus#readme"
                target="_blank"
                rel="noopener noreferrer"
              >
                LAOPLUS（Mod）
              </a>
              も作っています。
            </p>
            <p className="text-xs opacity-50">ややこしくて申し訳ない</p>
            <ol className="ml-5 flex list-outside list-disc flex-col gap-2">
              <li>
                E-mail: <span>eai@mizle.net</span>
              </li>
              <li>
                Discord:{" "}
                <a
                  href="https://discord.com/channels/913406465312690217/994859556599513139"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LAOPLUS Discord #📜general
                </a>
              </li>
              <li>
                Twitter:{" "}
                <a
                  href="https://twitter.com/eai04191"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @eai04191
                </a>
              </li>
            </ol>
          </FAQItem>
          <FAQItem title="ソースコードは？">
            <p>
              ウェブサイトのソースコードは
              <a
                href="https://github.com/laoplus/scv/"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/laoplus/scv
              </a>
              で公開されています。
            </p>
            <p>
              このリポジトリにはSCVのウェブサイトのソースコードのみが含まれており、ゲームのデータは含まれていません。
            </p>
          </FAQItem>
        </div>
      </div>
    </div>
  );
}
