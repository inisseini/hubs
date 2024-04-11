import { ToolbarButton } from "../../input/ToolbarButton";
// TO DO: look into changing icon theme handling to work with TS
// @ts-ignore
import { ReactComponent as LibraryIcon } from "../../../react-components/icons/library.svg";
import React, { useContext } from "react";
import { ChatContext } from "../contexts/ChatContext";
import { ToolTip } from "@mozilla/lilypad-ui";

const LibraryToolbarButton = ({ onClick, selected }) => {
  const { unreadMessages } = useContext(ChatContext);
  const description = "資料の検索ができます";

  return (
    <ToolTip description={description}>
      <ToolbarButton
        // Ignore type lint error as we will be redoing ToolbarButton in the future
        // @ts-ignore
        onClick={onClick}
        statusColor={unreadMessages ? "unread" : undefined}
        icon={selected ? <LibraryIcon fill="#007ab8" /> : <LibraryIcon fill="#ffffff" />}
        preset="accent4"
        label="ライブラリ"
        selected={selected}
      />
    </ToolTip>
  );
};

export default LibraryToolbarButton;
