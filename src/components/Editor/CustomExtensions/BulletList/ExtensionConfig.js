import { BulletList } from "@tiptap/extension-list";

export default BulletList.configure({
  HTMLAttributes: { class: "bulletList" },
  itemTypeName: "listItem",
});
