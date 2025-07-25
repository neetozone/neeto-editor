import i18n from "i18next";
import { noop } from "neetocist";

import directUploadsApi from "apis/direct_uploads";

import { generateChecksum } from "./utils";

class DirectUpload {
  constructor({ url, file, progress = noop }) {
    this.url = url;
    this.file = file;
    this.progress = progress;
    this.abortController = new AbortController();
  }

  create = async () => {
    if (!this.file.name || !this.file.size) {
      throw new Error(i18n.t("neetoEditor.error.corruptFile"));
    }

    const response = await this.generateUrl();
    const { url, headers } =
      response.direct_upload || response.data.direct_upload;
    const { id, signed_id } = response.data || response;
    await this.uploadToCloud(url, headers);
    await directUploadsApi.attach({ id, signed_id });

    return response;
  };

  generateUrl = async () => {
    const payload = {
      blob: {
        filename: this.file.name,
        byte_size: this.file.size,
        content_type: this.file.type,
        checksum: await generateChecksum(this.file),
      },
    };

    return directUploadsApi.generate(this.url, payload);
  };

  abort = () => this.abortController.abort();

  uploadToCloud = (url, headers) => {
    const config = {
      headers,
      onUploadProgress: this.progress,
      signal: this.abortController.signal,
    };

    return directUploadsApi.create(url, this.file, config);
  };
}

export default DirectUpload;
