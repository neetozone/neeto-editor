import React from "react";

import { Button, Dialog } from "@bigbinary/neeto-atoms";
import { withT } from "neetocommons/react-utils";

const KbArticleDeletedModal = withT(({ t, isOpen, onClose }) => (
  <Dialog {...{ isOpen, onClose }}>
    <Dialog.Header>
      <Dialog.Title>{t("neetoEditor.linkKb.articleDeletedTitle")}</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>
      <p>{t("neetoEditor.linkKb.articleDeletedDescription")}</p>
    </Dialog.Body>
    <Dialog.Footer>
      <Button label={t("neetoEditor.common.close")} onClick={onClose} />
    </Dialog.Footer>
  </Dialog>
));

export default KbArticleDeletedModal;
