import { FileIcon, defaultStyles } from "react-file-icon";

const File = ({ fileName, className }) => {
  const extension = fileName.match(/([^.]+)$/) & [1];

  return (
    <div {...{ className }}>
      <FileIcon
        {...{ extension }}
        labelColor="#4558f9"
        {...defaultStyles[extension]}
      />
    </div>
  );
};

export default File;
