import React, { useCallback, useContext, useEffect, useState, useRef } from "react";

import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { TextAreaInput } from "../input/TextAreaInput";
import styles from "./LibrarySidebarContainer.scss";

import GTIE1 from "../../assets/images/GTIE1.png";
import GTIE2 from "../../assets/images/GTIE2.png";
import GTIE3 from "../../assets/images/GTIE3.png";
import GTIE4 from "../../assets/images/GTIE4.png";
import GTIE5 from "../../assets/images/GTIE5.png";
import GTIE6 from "../../assets/images/GTIE6.png";
import GTIE7 from "../../assets/images/GTIE7.png";
import GTIE8 from "../../assets/images/GTIE8.png";

// NOTE: context and related functions moved to ChatContext
export function LibrarySidebarContainer({ onClose, scene, setQuestion }) {
  const ref = useRef();
  const [searchWord, setWord] = useState("");
  const [searchTag, setTag] = useState("");

  if (!localStorage.getItem("progressScore")) {
    localStorage.setItem("progressScore", 0);
    const list = [];
    localStorage.setItem("checkedQuestion", JSON.stringify(list));
  }

  const Document = ({ title, text, img, tag, id }) => {
    console.log("test", searchTag);
    if (searchWord.length > 0) {
      if (title.indexOf(searchWord) === -1 && text.indexOf(searchWord) === -1) return;
    }
    if (searchTag.length > 0) {
      console.log("test", searchTag);
      if (tag.indexOf(searchTag) === -1) return;
    }
    return (
      <div
        onClick={() => {
          setQuestion(id);
          scene.emit("add_media", img);
          if(!sessionStorage.getItem("objectTutorial")) {
            sessionStorage.setItem("objectTutorial", true);
            alert("オブジェクトは右クリックで詳細を確認することができます。リンクを取得したり、理解度チェックを受けてみてください。")
          }
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px 0",
          boxShadow: "2px 2px 4px #dfdfdf",
          borderRadius: "10px",
          padding: "8px 16px",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            height: "100%",
            width: "120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexShrink: "0"
          }}
        >
          <img
            src={img}
            style={{
              width: "120px",
              height: "80px",
              objectFit: "cover"
            }}
          />
        </div>
        <div style={{ overflow: "hidden" }}>
          <h4>{title}</h4>
          <br />
          <p style={{ overflowY: "auto" }} className={styles.hiddenScrollBar}>
            {text}
          </p>
          <br />
          <div
            style={{
              textAlign: "right",
              color: "#ffffff",
              borderRadius: "15px",
              backgroundColor: "#007ab8",
              display: "inline-block",
              padding: "6px 12px",
              fontSize: "10px",
              cursor: "pointer"
            }}
            onClick={e => onClickTags(e)}
          >
            {tag}
          </div>
        </div>
      </div>
    );
  };

  const searchDocuments = event => {
    if (event.target.value.indexOf("タグ検索：") !== -1) {
      setWord("");
    } else {
      setWord(event.target.value);
      setTag("");
    }
  };

  const onClickTags = tag => {
    ref.current.innerText = "タグ検索：" + tag.target.innerText;
    setTag(tag.target.innerText);
  };

  return (
    <Sidebar title="ライブラリ" beforeTitle={<CloseButton onClick={onClose} />} disableOverflowScroll>
      <div
        style={{
          padding: "8px 16px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <h3
          style={{
            textAlign: "right",
            margin: "16px 0",
            color: "#ffffff",
            borderRadius: "10px",
            backgroundColor: "#007ab8",
            display: "inline-block",
            padding: "8px 16px"
          }}
        >
          学習の進捗ポイント: {localStorage.getItem("progressScore")} pt
        </h3>
        <TextAreaInput
          ref={ref}
          textInputStyles={styles.libraryInputTextAreaStyles}
          placeholder="資料をキーワードやタグで検索する"
          onChange={e => searchDocuments(e)}
        />
        <div
          style={{
            overflowY: "auto",
            height: "calc(100% - 60px)",
            padding: "8px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px 0"
          }}
          className={styles.hiddenScrollBar}
        >
          <Document
            title="アントレプレナーシップとは？必要な心構え・スキルを解説"
            text="
              講師/石倉 大樹 Ishikura Daiki
              株式会社Logomix 代表取締役CEO
            "
            img={GTIE1}
            tag="アントレプレナーシップ"
            id={0}
          />
          <Document
            title="起業検討をする研究者向けのファンドについてー グラント、エクイティ、デッドの使い分けー"
            text="
              講師/名倉 勝 Nagura Masaru
              CIC Tokyo ゼネラル・マネージャー
            "
            img={GTIE2}
            tag="ファイナンス"
            id={1}
          />
          <Document
            title="エクイティ調達におけるベンチャーキャピタルの選定方法について"
            text="
              講師/古城 巧 Kojo Takumi
              Strive マネージャー
            "
            img={GTIE3}
            tag="VCからのエクイティ調達"
            id={2}
          />
          <Document
            title="技術系スタートアップの事業計画作成の基礎について"
            text="
              講師/高橋 遼平 Takahashi Ryohei
              みらい創造機構 執行役員
            "
            img={GTIE4}
            tag="事業計画"
            id={3}
          />
          <Document
            title="大学発ベンチャーの知財戦略の重要性について"
            text="
              講師/清野 千秋 Seino Chiaki
              東京工業大学 特任教授
            "
            img={GTIE5}
            tag="特許・知財戦略"
            id={4}
          />
          <Document
            title="PMF(プロダクト・マーケット・フィット)とは？達成までの手順について"
            text="
              講師/原 健一郎 Hara Kenichiro
              DCM プリンシパル
            "
            img={GTIE6}
            tag="プロダクト開発"
            id={5}
          />
          <Document
            title="創業期におけるスタートアップの人材採用の考え方について"
            text="
              講師/河合 総一郎 Kawai Souichiro
              ReBoost 代表取締役社長
            "
            img={GTIE7}
            tag="創業期の人材採用"
            id={6}
          />
          <Document
            title="事例で学ぶ資本政策について"
            text="
              講師/山岡 佑 yamaoka Task
              株式会社シクミヤ 代表取締役社長
            "
            img={GTIE8}
            tag="スタートアップの資本政策"
            id={7}
          />
        </div>
      </div>
    </Sidebar>
  );
}
