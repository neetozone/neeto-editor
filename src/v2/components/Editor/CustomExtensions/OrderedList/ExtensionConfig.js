import { OrderedList } from "@tiptap/extension-list";

export default OrderedList.configure({
  HTMLAttributes: { class: "orderedList" },
  itemTypeName: "listItem",
});
