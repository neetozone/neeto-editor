import { BulletList } from "@tiptap/extension-list";

export default BulletList.extend({
  HTMLAttributes: { class: "bulletList" },
  itemTypeName: "listItem",
});
