import dynamic from "next/dynamic";
import { useEffect } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const QuillEditor = ({ value, onChange }) => {
  return <ReactQuill value={value} onChange={onChange} theme="snow" />;
};

export default QuillEditor;
