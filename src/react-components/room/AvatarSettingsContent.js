import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, AcceptButton } from "../input/Button";
import styles from "./AvatarSettingsContent.scss";
import { TextInputField } from "../input/TextInputField";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export function AvatarSettingsContent({
  displayName,
  pronouns,
  profile,
  friendContent,
  sendDiscordMessage,
  displayNameInputRef,
  pronounsInputRef,
  profileInputRef,
  friendContentInputRef,
  sendDiscordMessageInputRef,
  disableDisplayNameInput,
  onChangeDisplayName,
  onChangePronouns,
  onChangeProfile,
  onChangefriendContent,
  onChangeSendDiscordMessage,
  avatarPreview,
  displayNamePattern,
  pronounsPattern,
  profilePattern,
  friendContentPattern,
  sendDiscordMessagePattern,
  onChangeAvatar,
  ...rest
}) {
  console.log("avatarsettingscontent original");

  const [fileName, setFileName] = useState(undefined);

  const DBClient = new DynamoDBClient({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: "AKIA6O7CLSZWBGWOEKTK",
      secretAccessKey: "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"
    }
  });

  const docClient = DynamoDBDocumentClient.from(DBClient);

  const convert = async input => {
    const response = await fetch(
      "https://2vdssaox3xixy7rfz4tr3lh3my0wfslu.lambda-url.ap-northeast-1.on.aws/", // 関数URL
      {
        body: JSON.stringify(input),
        method: "POST"
      }
    ).then(res => res.json());

    return response;
  };

  const iconContainerBaseURL = "https://metacampusassets.s3.ap-northeast-1.amazonaws.com/" + displayName + ".jpg";

  const uploadToClient = event => {
    if (event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];

      reader.onload = async event => {
        const base64_image = event.currentTarget.result;
        const { base64_image: resizedBase64 } = await convert({
          base64_image,
          width: 800,
          height: 800,
          fit: "cover",
          withoutEnlargement: true,
          toFormat: "jpg",
          file,
          user: displayName
        });
        Base64ToImage(base64_image, function (img) {
          const target = document.getElementById("iconContainer");
          const child = document.getElementById("uploadedImg");
          if (child) target.removeChild(child);
          target.appendChild(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const Base64ToImage = (base64img, callback) => {
    var img = new Image();
    img.onload = function () {
      callback(img);
    };
    img.src = base64img;
    img.id = "uploadedImg";
  };

  const imagecheck = url => {
    const child = document.getElementById("uploadedImg");
    if (child) return;
    var newImage = new Image();

    // 画像があった時の処理
    newImage.onload = () => {
      console.log("アイコン有" + url);
      document.getElementById("iconContainer").appendChild(newImage);
    };

    // 画像がなかった時の処理
    newImage.onerror = () => {
      console.log("アイコン無" + url);
    };
    newImage.src = url;
    newImage.id = "uploadedImg";
  };

  imagecheck(iconContainerBaseURL);

  return (
    <Column as="form" className={styles.content} {...rest}>
      <div id="iconContainer" className={styles.icon}></div>

      <input type="file" onChange={uploadToClient} />
      <TextInputField
        disabled={disableDisplayNameInput}
        label={<FormattedMessage id="avatar-settings-content.display-name-label" defaultMessage="Display Name" />}
        value={displayName}
        pattern={displayNamePattern}
        spellCheck="false"
        required
        onChange={onChangeDisplayName}
        description={
          <FormattedMessage
            id="avatar-settings-content.display-name-description"
            defaultMessage="Alphanumerics, Japanese, hyphens, underscores, and tildes. At least 3 characters, no more than 32"
          />
        }
        ref={displayNameInputRef}
      />
      <TextInputField
        label={
          <>
            <FormattedMessage id="avatar-settings-content.display-profile-label" defaultMessage="Profile (optional)" />
            <br />
            <p>全体に公開するプロフィールです。</p>
          </>
        }
        value={profile}
        pattern={profilePattern}
        spellCheck="false"
        onChange={onChangeProfile}
        description={
          <>
            <FormattedMessage
              id="avatar-settings-content.display-profile-description"
              defaultMessage="Alphanumerics, hyphens, underscores, and tildes. No more than 32"
            />
            <br />
            <p>フレンドにのみ公開するプロフィールです。本名や所属大学・組織を記入することを推奨します。</p>
          </>
        }
        ref={profileInputRef}
      />
      <TextInputField
        label={
          <FormattedMessage
            id="avatar-settings-content.display-friendContent-label"
            defaultMessage="フレンド限定表示内容"
          />
        }
        value={friendContent}
        pattern={friendContentPattern}
        spellCheck="false"
        onChange={onChangefriendContent}
        description={
          <FormattedMessage
            id="avatar-settings-content.display-friendContent-description"
            defaultMessage="フレンドにのみ表示される情報です"
          />
        }
        ref={friendContentInputRef}
      />
      <TextInputField
        label={
          <FormattedMessage
            id="avatar-settings-content.sendDiscordMessage-label"
            defaultMessage="入室時にDiscord通知を行う"
          />
        }
        value={sendDiscordMessage}
        pattern={sendDiscordMessagePattern}
        spellCheck="false"
        onChange={onChangeSendDiscordMessage}
        ref={sendDiscordMessageInputRef}
      />
      <TextInputField
        label={<FormattedMessage id="avatar-settings-content.pronouns-label" defaultMessage="Pronouns (optional)" />}
        value={pronouns}
        pattern={pronounsPattern}
        spellCheck="false"
        onChange={onChangePronouns}
        ref={pronounsInputRef}
      />
      <div className={styles.avatarPreviewContainer}>
        {avatarPreview || <div />}
        <Button type="button" preset="basic" onClick={onChangeAvatar}>
          <FormattedMessage id="avatar-settings-content.change-avatar-button" defaultMessage="Change Avatar" />
        </Button>
      </div>
      <AcceptButton preset="accept" type="submit" />
    </Column>
  );
}

AvatarSettingsContent.propTypes = {
  className: PropTypes.string,
  displayName: PropTypes.string,
  pronouns: PropTypes.string,
  profile: PropTypes.string,
  displayNameInputRef: PropTypes.func,
  pronounsInputRef: PropTypes.func,
  profileInputRef: PropTypes.func,
  disableDisplayNameInput: PropTypes.bool,
  displayNamePattern: PropTypes.string,
  pronounsPattern: PropTypes.string,
  profilePattern: PropTypes.string,
  friendContentPattern: PropTypes.string,
  onChangeDisplayName: PropTypes.func,
  onChangePronouns: PropTypes.func,
  onChangeProfile: PropTypes.func,
  avatarPreview: PropTypes.node,
  onChangeAvatar: PropTypes.func
};
