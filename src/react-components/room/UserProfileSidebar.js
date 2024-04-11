import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { BackButton } from "../input/BackButton";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";
import styles from "./UserProfileSidebar.scss";
import { FormattedMessage, useIntl } from "react-intl";
import { Slider } from "../input/Slider";
import { ToolbarButton } from "../input/ToolbarButton";
import { ReactComponent as VolumeHigh } from "../icons/VolumeHigh.svg";
import { ReactComponent as VolumeMuted } from "../icons/VolumeMuted.svg";
import useAvatarVolume from "./hooks/useAvatarVolume";
import { calcLevel, calcGainMultiplier, MAX_VOLUME_LABELS } from "../../utils/avatar-volume-utils";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const DBClient = new DynamoDBClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY
  }
});

const docClient = DynamoDBDocumentClient.from(DBClient);

const MIN = 0;
const MAX = MAX_VOLUME_LABELS - 1;

export function UserProfileSidebar({
  className,
  userId,
  displayName,
  pronouns,
  profile,
  friendContent,
  sendDiscordMessage,
  identityName,
  avatarPreview,
  hasMicPresence,
  isSignedIn,
  canPromote,
  onPromote,
  canDemote,
  onDemote,
  isHidden,
  onToggleHidden,
  canMute,
  isNetworkMuted,
  onMute,
  canKick,
  onKick,
  onSendFriendRequest,
  showBackButton,
  onBack,
  onClose,
  ...rest
}) {
  const intl = useIntl();
  const [multiplier, updateMultiplier, isMuted, updateMuted] = useAvatarVolume(userId);
  const onLevelChanged = useCallback(
    level => {
      updateMultiplier(calcGainMultiplier(level));
    },
    [updateMultiplier]
  );
  const newLevel = calcLevel(multiplier);

  const [canShow, setShow] = useState(false);

  const checkRelationship = () => {
    /*const Get = async () => {
      const command = new GetCommand({
        TableName: 'accounts',
        Key: {
          key: 'settings',
        },
      });
  
      const response = await docClient.send(command);
      setValues({
        openingTime: response.Item.openingTime,
        closingTime: response.Item.closingTime,
      });
    };
    
    Get();*/

    const me = window.APP.hubChannel.store.state.profile.displayName;
    if (me === displayName) return;
    const friendList = localStorage.getItem("friends");
    const result = friendList.includes(displayName);
    if (result) {
      setShow(true);
    }
  };

  return (
    <Sidebar
      beforeTitle={showBackButton ? <BackButton onClick={onBack} /> : <CloseButton onClick={onClose} />}
      className={className}
      {...rest}
    >
      <Column center padding>
        <h2 className={styles.displayName}>{identityName ? `${displayName} (${identityName})` : displayName}</h2>
        {pronouns && <span className={styles.pronouns}>{pronouns}</span>}
        {profile && <span className={styles.profile}>{profile}</span>}
        {!canShow && <button onClick={checkRelationship}>フレンド限定内容を見る</button>}
        {canShow && friendContent && <span className={styles.profile}>{friendContent}</span>}
        {sendDiscordMessage && <span className={styles.profile}>{sendDiscordMessage}</span>}
        <div className={styles.avatarPreviewContainer}>{avatarPreview || <div />}</div>
        {hasMicPresence && (
          <div className={styles.sliderContainer}>
            <ToolbarButton
              icon={isNetworkMuted || isMuted ? <VolumeMuted /> : <VolumeHigh />}
              selected={isNetworkMuted || isMuted}
              preset="accent4"
              style={{ display: "block" }}
              onClick={() => {
                updateMuted(!isMuted);
              }}
              disabled={isNetworkMuted}
            />
            <Slider
              min={MIN}
              max={MAX}
              step={1}
              value={newLevel}
              onChange={onLevelChanged}
              className={styles.sliderInputContainer}
              disabled={isNetworkMuted || isMuted}
            />
          </div>
        )}
        {canPromote && (
          <Button
            preset="accept"
            disabled={!isSignedIn}
            title={
              isSignedIn
                ? intl.formatMessage({ id: "user-profile-sidebar.promote-button", defaultMessage: "Promote" })
                : intl.formatMessage(
                    {
                      id: "user-profile-sidebar.promote-button-disabled-label",
                      defaultMessage: "{displayName} is signed out."
                    },
                    { displayName }
                  )
            }
            onClick={onPromote}
          >
            <FormattedMessage id="user-profile-sidebar.promote-button" defaultMessage="Promote" />
          </Button>
        )}
        {canDemote && (
          <Button
            preset="cancel"
            disabled={!isSignedIn}
            title={
              isSignedIn
                ? intl.formatMessage({ id: "user-profile-sidebar.demote-button", defaultMessage: "Demote" })
                : intl.formatMessage(
                    {
                      id: "user-profile-sidebar.demote-button-disabled-label",
                      defaultMessage: "{displayName} is signed out."
                    },
                    { displayName }
                  )
            }
            onClick={onDemote}
          >
            <FormattedMessage id="user-profile-sidebar.demote-button" defaultMessage="Demote" />
          </Button>
        )}
        <Button onClick={onToggleHidden}>
          {isHidden ? (
            <FormattedMessage id="user-profile-sidebar.unhide-button" defaultMessage="Unhide" />
          ) : (
            <FormattedMessage id="user-profile-sidebar.hide-button" defaultMessage="Hide" />
          )}
        </Button>
        {canMute && (
          <Button preset="cancel" onClick={onMute}>
            <FormattedMessage id="user-profile-sidebar.mute-button" defaultMessage="Mute" />
          </Button>
        )}
        {canKick && (
          <Button preset="cancel" onClick={onKick}>
            <FormattedMessage id="user-profile-sidebar.kick-button" defaultMessage="Kick" />
          </Button>
        )}
        <Button preset="cancel" onClick={onSendFriendRequest}>
          <FormattedMessage id="user-profile-sidebar.friend-button" defaultMessage="Send Friend Request" />
        </Button>
      </Column>
    </Sidebar>
  );
}

UserProfileSidebar.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string,
  displayName: PropTypes.string,
  pronouns: PropTypes.string,
  profile: PropTypes.string,
  friendContent: PropTypes.string,
  sendDiscordMessage: PropTypes.string,
  identityName: PropTypes.string,
  avatarPreview: PropTypes.node,
  hasMicPresence: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  canPromote: PropTypes.bool,
  onPromote: PropTypes.func,
  canDemote: PropTypes.bool,
  onDemote: PropTypes.func,
  isHidden: PropTypes.bool,
  onToggleHidden: PropTypes.func,
  canMute: PropTypes.bool,
  isNetworkMuted: PropTypes.bool,
  onMute: PropTypes.func,
  canKick: PropTypes.bool,
  onKick: PropTypes.func,
  onSendFriendRequest: PropTypes.func,
  showBackButton: PropTypes.bool,
  onBack: PropTypes.func,
  onClose: PropTypes.func
};
