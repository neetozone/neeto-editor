import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";

export const TodoListExtension = TaskList.extend({
  name: "todoList",
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-9": () => this.editor.commands.toggleTaskList(),
    };
  },
});

export const TodoItemExtension = TaskItem.extend({
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name),
    };
  },
}).configure({ nested: true });

export default TodoListExtension;
