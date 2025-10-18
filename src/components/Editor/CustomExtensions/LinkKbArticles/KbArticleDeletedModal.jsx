import React from "react";

import { withT } from "neetocommons/react-utils";
import { Button, Modal } from "neetoui";

const KbArticleDeletedModal = withT(({ t, isOpen, onClose }) => (
  <Modal {...{ isOpen, onClose }}>
    <Modal.Header>
      <h2>{t("neetoEditor.linkKb.articleDeletedTitle")}</h2>
    </Modal.Header>
    <Modal.Body>
      <p>{t("neetoEditor.linkKb.articleDeletedDescription")}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button label={t("neetoEditor.common.close")} onClick={onClose} />
    </Modal.Footer>
  </Modal>
));

export default KbArticleDeletedModal;
