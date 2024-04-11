import React, { useCallback, useContext, useEffect, useState, useRef } from "react";

import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { TextAreaInput } from "../input/TextAreaInput";
import styles from "./LibrarySidebarContainer.scss";

import discordBotLogo from "../../assets/images/discord-bot-logo.png";

// NOTE: context and related functions moved to ChatContext
export function LibraryTestSidebarContainer({ onClose, scene, questionNum }) {
  const questionResultContainer = useRef();

  const questions = [
    {
      GTIE: [
        {
          questionText: "起業をするにあたって重要な要素のうち該当しないものはどれ？",
          answerOptions: [
            { answerText: "チーム", isCorrect: false },
            { answerText: "マーケットとプロダクト", isCorrect: false },
            { answerText: "事業提携先", isCorrect: true }
          ]
        },
        {
          questionText: "プロダクトにおいて起業家がすべきことは？",
          answerOptions: [
            { answerText: "製品に完全さを求めすぎない", isCorrect: true },
            { answerText: "尊敬している投資家・支援者のアイディアに飛びつく", isCorrect: false },
            { answerText: "パートナーシップに最大限注力する", isCorrect: false }
          ]
        },
        {
          questionText: "ファウンダーマーケットフィットについて意識すべき事項は？該当しないものを選んでください",
          answerOptions: [
            { answerText: "執着・経験値", isCorrect: false },
            { answerText: "性格・バックボーンストーリー", isCorrect: false },
            { answerText: "資産", isCorrect: true }
          ]
        },
        {
          questionText: "起業にあたって整えておくべき起業家の環境やライフスタイルについて該当しないものは？",
          answerOptions: [
            { answerText: "スタートアップに集中できるようなプライベート・ホームになっているか", isCorrect: false },
            { answerText: "睡眠・運動・食事に影響を受けないと過信しない", isCorrect: false },
            { answerText: "SNS含め情報をなんでも大量に仕入れ日々確認できる仕組み", isCorrect: true }
          ]
        }
      ]
    },
    {
      GTIE: [
        {
          questionText:
            "大学発スタートアップが起業準備の前段階である基礎研究・応用研究の段階で資金調達をするときに推奨される調達手段はどれか？",
          answerOptions: [
            { answerText: "グラントでの調達", isCorrect: true },
            { answerText: "エクイティでの調達", isCorrect: false },
            { answerText: "デットでの調達", isCorrect: false }
          ]
        },
        {
          questionText: "NEDO 認定VC から受けられる資金で、エクイティとグラント両方の側面を持つNEDO の支援はなにか？",
          answerOptions: [
            { answerText: "TCP", isCorrect: false },
            { answerText: "NEP", isCorrect: false },
            { answerText: "STS", isCorrect: true }
          ]
        },
        {
          questionText:
            "スタートアップに投資をする際の投資家の視点は、いくつかありますが「市場」「競争力」の他に今回の講義で何が重要であると述べていたか？",
          answerOptions: [
            { answerText: "新規性", isCorrect: false },
            { answerText: "チーム（共同経営者の存在）", isCorrect: true },
            { answerText: "売上", isCorrect: false }
          ]
        },
        {
          questionText:
            "事業化のための資金獲得に向けてやるべきことのうち、適切でないと思われるものは次のうちどれか？（今回の講義内容に沿って答えるものとする）",
          answerOptions: [
            { answerText: "投資家からのフィードバック", isCorrect: false },
            { answerText: "知的財産の整理", isCorrect: false },
            { answerText: "オフィスの整備", isCorrect: true }
          ]
        }
      ]
    },
    {
      GTIE: [
        {
          questionText: "エクイティ調達を説明しているものとして当てはまらないものはどれ？",
          answerOptions: [
            { answerText: "資金の返済や利子の支払いがない", isCorrect: false },
            { answerText: "経営への介入がおき得る", isCorrect: false },
            { answerText: "財務状況が悪い中での資金調達が難しい", isCorrect: true }
          ]
        },
        {
          questionText: "CVCではなく純VCの説明として当てはまらないものはどれ？",
          answerOptions: [
            { answerText: "事業ステージごとに強みをもつVCがいる", isCorrect: false },
            {
              answerText: "事業の壁打ち、営業、採用、PR支援などファンドによってさまざまな支援プランがある",
              isCorrect: false
            },
            { answerText: "事業提携等ストラテジックリターン目的が多い", isCorrect: true }
          ]
        },
        {
          questionText: "エクイティ調達（＝株主）による経営リスクとして間違っているものは？",
          answerOptions: [
            { answerText: "経営の目線が合わない", isCorrect: false },
            { answerText: "株主間でコンフリクトが発生", isCorrect: false },
            { answerText: "資本政策は適宜やり直しが効く", isCorrect: true }
          ]
        },
        {
          questionText: "VC選定時のポイントとして間違っているものは？",
          answerOptions: [
            { answerText: "対象としている投資領域", isCorrect: false },
            { answerText: "対象としている投資ステージとリード投資可否", isCorrect: false },
            { answerText: "調達資金の返済における利子", isCorrect: true }
          ]
        }
      ]
    },
    {
      GTIE: [
        {
          questionText: "",
          answerOptions: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: true }
          ]
        },
        {
          questionText: "",
          answerOptions: [
            { answerText: "", isCorrect: true },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false }
          ]
        },
        {
          questionText: "",
          answerOptions: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: true }
          ]
        },
        {
          questionText: "",
          answerOptions: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: true }
          ]
        }
      ]
    },
    {
      GTIE: [
        {
          questionText: "知的財産に関する以下の記述のうち、誤りがあるものはどれか。",
          answerOptions: [
            {
              answerText: "知的財産権は、知財の創作者に与えられる独占権であり、様々な法律で保護されている",
              isCorrect: false
            },
            { answerText: "著作権の保護対象には、文芸、学術、美術、音楽、プログラムが含まれる", isCorrect: false },
            {
              answerText:
                "特許権と著作権は、権利が存在する場合、第三者が意図的にまねしたわけでなくても、知らなかったでは済まされず、権利侵害となる",
              isCorrect: true
            }
          ]
        },
        {
          questionText: "特許に関する以下の記述のうち、誤りがあるものはどれか。",
          answerOptions: [
            {
              answerText:
                "出願する前に論文や展示会などで自分の発明を公開したとしても、その発明が優れていれば、特許を取ることに支障はない",
              isCorrect: true
            },
            {
              answerText:
                "特許出願すると、一定期間の後で出願した内容が公開され、審査を受けて権利化すれば、その内容も必ず公開される",
              isCorrect: false
            },
            {
              answerText:
                "特許を権利化するメリットとして、模倣を防止し、事業の差別化ができることや、ライセンス等による事業提携・拡大のツールになること等があげられる",
              isCorrect: false
            }
          ]
        },
        {
          questionText: "知財戦略の考え方として、好ましくないものはどれか。",
          answerOptions: [
            { answerText: "自社に必要な知財を考えるときは、ビジネスモデルから必要な範囲を考える", isCorrect: false },
            {
              answerText: "模倣されても侵害と判別できない技術なら、特許出願せずに秘匿することも視野に入れる",
              isCorrect: false
            },
            { answerText: "優れた技術はとにかく早く、国内でも海外でも特許出願しておけばよい", isCorrect: true }
          ]
        },
        {
          questionText: "知財の権利の帰属に関する以下の記述のうち、誤りがあるものはどれか",
          answerOptions: [
            {
              answerText: "研究成果を含む様々な成果物の知的財産権は、原則、成果物を創作した本人に権利が発生する",
              isCorrect: false
            },
            {
              answerText:
                "大学に権利を承継した特許であっても、自分が発明者であれば、自分が起業した会社で特許を実施することに制限は無い",
              isCorrect: true
            },
            {
              answerText:
                "特許が複数の大学や企業による共同出願である場合、原則、技術移転には共有者全員の同意が必要である",
              isCorrect: false
            }
          ]
        }
      ]
    },
    {
      GTIE: [
        {
          questionText: "PMFにおいて間違った見立てはどれ？",
          answerOptions: [
            { answerText: "プロダクトローンチ前から大型調達に成功", isCorrect: true },
            { answerText: "顧客の継続率が良い", isCorrect: false },
            {
              answerText:
                "プロダクトコンセプトを持って顧客候補を回ったら、かなりの好反応。ローンチ前に契約もとれはじめた",
              isCorrect: false
            }
          ]
        },
        {
          questionText: "PMFをはかる方法として間違っているものはどれ？",
          answerOptions: [
            { answerText: "リテンション", isCorrect: false },
            { answerText: "プロダクトごとに異なるエンゲージメント", isCorrect: false },
            { answerText: "プレスリリースのPV", isCorrect: true }
          ]
        },
        {
          questionText: "PMFをはかる指標として当てはまらないものは？",
          answerOptions: [
            { answerText: "ユーザーの課題が解決されているか？", isCorrect: false },
            { answerText: "ユーザーに満足されているか？", isCorrect: false },
            { answerText: "登録ユーザー数は多いか？", isCorrect: true }
          ]
        },
        {
          questionText: "PMFを見つけるときのコツとして間違っているものはどれ？",
          answerOptions: [
            { answerText: "エンゲージメントのKPIを決め、計測する", isCorrect: false },
            { answerText: "ユーザーの声を聞いて、改善する", isCorrect: false },
            { answerText: "ターゲットセグメントでないユーザーの声は無視する", isCorrect: true }
          ]
        }
      ]
    },
    {
      GTIE: [
        {
          questionText: "スタートアップの組織づくりにおいてまず最初に取り組むべきことは？",
          answerOptions: [
            { answerText: "採用", isCorrect: true },
            { answerText: "評価制度の策定", isCorrect: false },
            { answerText: "人材育成", isCorrect: false }
          ]
        },
        {
          questionText: "「どんな役割を採用してビジネスを進めるか」を考えた時に意識するといいことは？",
          answerOptions: [
            { answerText: "似ているビジネスモデル", isCorrect: true },
            { answerText: "共同創業者の意向", isCorrect: false },
            { answerText: "採用候補者の強み", isCorrect: false }
          ]
        },
        {
          questionText: "各CxO人材の認識として正しいものは？",
          answerOptions: [
            {
              answerText: "COO＝CEOのタイプに合わせ柔軟に経営と現場を繋ぐために必要な実務の全体設計と実務を行う人",
              isCorrect: true
            },
            { answerText: "CFO＝VCや金融機関と交渉し資金調達を行う人", isCorrect: false },
            { answerText: "CTO＝開発力に長けている人", isCorrect: false }
          ]
        },
        {
          questionText: "初期の採用手法のうち社員または知人の推薦・紹介で行われるのもをなんというか？",
          answerOptions: [
            { answerText: "ダイレクトリクルーティング", isCorrect: false },
            { answerText: "リファラルリクルーティング", isCorrect: true },
            { answerText: "Meet-Up", isCorrect: false }
          ]
        }
      ]
    },
    {
      GTIE: [
        {
          questionText: "",
          answerOptions: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: true }
          ]
        },
        {
          questionText: "",
          a0nswerOptions: [
            { answerText: "", isCorrect: true },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false }
          ]
        },
        {
          questionText: "",
          answerOptions: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: true }
          ]
        },
        {
          questionText: "",
          answerOptions: [
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: false },
            { answerText: "", isCorrect: true }
          ]
        }
      ]
    }
  ];

  const [current, setCurrent] = useState(0);
  const [showFinish, setShowFinish] = useState(false);
  const [score, setScore] = useState(0);
  const [instantScore, setInstantScore] = useState(0);

  useEffect(() => {
    if (showFinish && questions[questionNum].GTIE.length === score) {
      const list = JSON.parse(localStorage.getItem("checkedQuestion"));
      if (list.indexOf(questionNum) !== -1) {
        setInstantScore(0);
        return;
      }
      setInstantScore(10);
      list.push(questionNum);
      localStorage.setItem("checkedQuestion", JSON.stringify(list));
      localStorage.setItem("progressScore", Number(localStorage.getItem("progressScore")) + 10);
    }
  }, [showFinish]);

  const toFullWidth = str => {
    // 半角英数字を全角に変換
    str = str.replace(/[A-Za-z0-9]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
    });
    return str;
  };

  const check = isCorrect => {
    if (isCorrect === true) {
      setScore(score + 1);
      const result = document.createElement("p");
      result.innerText = "第" + toFullWidth(String(current + 1)) + "問：正解";
      questionResultContainer.current.appendChild(result);
    } else {
      const result = document.createElement("p");
      result.innerText = "第" + toFullWidth(String(current + 1)) + "問：不正解";
      questionResultContainer.current.appendChild(result);
    }

    const nextQuestion = current + 1;
    if (nextQuestion < questions[questionNum].GTIE.length) {
      setCurrent(nextQuestion);
    } else {
      setShowFinish(true);
    }
  };

  console.log("test", questionNum, questions[questionNum]);

  return (
    <Sidebar title="理解度チェック" beforeTitle={<CloseButton onClick={onClose} />} disableOverflowScroll>
      <div
        style={{
          padding: "8px 16px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            overflowY: "auto",
            height: "100%",
            padding: "8px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px 0"
          }}
          className={styles.hiddenScrollBar}
        >
          {showFinish ? (
            <p>
              {questions[questionNum].GTIE.length}問中{score}問正解
              <br />
              <br />
              {questions[questionNum].GTIE.length === score ? (
                <p>
                  全問正解です!!
                  <br />
                  {instantScore}ポイント獲得しました。
                </p>
              ) : (
                <p>ポイント獲得を目指して再挑戦しましょう！</p>
              )}
            </p>
          ) : (
            <div className="quiz_wrap">
              <h3>第{score + 1}問</h3>
              <br />
              <p>{questions[questionNum].GTIE[current].questionText}</p>
              <br />
              <ul>
                {questions[questionNum].GTIE[current].answerOptions.map((answer, key) => (
                  <li
                    style={{
                      boxShadow: "2px 2px 4px #dfdfdf",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      marginBottom: "8px",
                      cursor: "pointer"
                    }}
                    key={key}
                    onClick={() => check(answer.isCorrect)}
                  >
                    {answer.answerText}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <br />
          <div ref={questionResultContainer}></div>
        </div>
      </div>
    </Sidebar>
  );
}
