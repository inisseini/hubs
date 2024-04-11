import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { ReactComponent as EnterIcon } from "../icons/Enter.svg";
import { ReactComponent as VRIcon } from "../icons/VR.svg";
import { ReactComponent as ShowIcon } from "../icons/Show.svg";
import { ReactComponent as SettingsIcon } from "../icons/Settings.svg";
import styles from "./RoomEntryModal.scss";
import styleUtils from "../styles/style-utils.scss";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import { Column } from "../layout/Column";
import { AppLogo } from "../misc/AppLogo";
import { FormattedMessage } from "react-intl";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export function RoomEntryModal({
  className,
  roomName,
  showJoinRoom,
  onJoinRoom,
  showEnterOnDevice,
  onEnterOnDevice,
  showSpectate,
  onSpectate,
  showRoomSettings,
  onRoomSettings,
  ...rest
}) {
  const [isNamed, setName] = useState(false);
  const DBClient = new DynamoDBClient({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: "AKIA6O7CLSZWBGWOEKTK",
      secretAccessKey: "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"
    }
  });

  const docClient = DynamoDBDocumentClient.from(DBClient);

  const GetRoom = async () => {
    const command = new GetCommand({
      TableName: "roomParameter",
      Key: {
        URL: location.href
      }
    });

    const response = await docClient.send(command);
    setName(response.Item.name);
  };

  GetRoom();

  const breakpoint = useCssBreakpoints();
  return (
    <Modal className={classNames(styles.roomEntryModal, className)} disableFullscreen {...rest}>
      <Column center className={styles.content}>
        {breakpoint !== "sm" && breakpoint !== "md" && <AppLogo className={styles.logo} />}
        <div className={styles.roomName}>
          <h5>
            <FormattedMessage id="room-entry-modal.room-name-label" defaultMessage="Room Name" />
          </h5>
          <p>{isNamed ? isNamed : roomName}</p>
        </div>
        <Column center className={styles.buttons}>
          {showJoinRoom && (
            <Button preset="accent4" onClick={onJoinRoom}>
              <EnterIcon />
              <span>
                <FormattedMessage id="room-entry-modal.join-room-button" defaultMessage="Join Room" />
              </span>
            </Button>
          )}
          {showSpectate && (
            <Button preset="accent2" onClick={onSpectate}>
              <ShowIcon />
              <span>
                <FormattedMessage id="room-entry-modal.spectate-button" defaultMessage="Spectate" />
              </span>
            </Button>
          )}
          {showRoomSettings && breakpoint !== "sm" && (
            <>
              <hr className={styleUtils.showLg} />
              <Button preset="transparent" className={styleUtils.showLg} onClick={onRoomSettings}>
                <SettingsIcon />
                <span>
                  <FormattedMessage id="room-entry-modal.room-settings-button" defaultMessage="Room Settings" />
                </span>
              </Button>
            </>
          )}
        </Column>
      </Column>
    </Modal>
  );
}

RoomEntryModal.propTypes = {
  className: PropTypes.string,
  roomName: PropTypes.string.isRequired,
  showJoinRoom: PropTypes.bool,
  onJoinRoom: PropTypes.func,
  showEnterOnDevice: PropTypes.bool,
  onEnterOnDevice: PropTypes.func,
  showSpectate: PropTypes.bool,
  onSpectate: PropTypes.func,
  showRoomSettings: PropTypes.bool,
  onRoomSettings: PropTypes.func
};

RoomEntryModal.defaultProps = {
  showJoinRoom: true,
  showEnterOnDevice: true,
  showSpectate: true,
  showRoomSettings: true
};
