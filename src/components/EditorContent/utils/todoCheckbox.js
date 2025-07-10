export const handleTodoCheckboxClick = (event, editorContentRef, onChange) => {
  if (
    !(
      event.target.type === "checkbox" &&
      event.target.closest('ul[data-type="todoList"] li[data-type="taskItem"]')
    )
  ) {
    return;
  }

  const checkbox = event.target;
  const listItem = checkbox.closest("li");

  if (listItem) {
    listItem.setAttribute("data-checked", checkbox.checked.toString());

    if (checkbox.checked) {
      checkbox.setAttribute("checked", "checked");
    } else {
      checkbox.removeAttribute("checked");
    }

    onChange?.(editorContentRef?.innerHTML);
  }
};

export const syncTodoCheckboxStates = editorContentRef => {
  if (!editorContentRef) return;

  const todoItems = editorContentRef.querySelectorAll(
    `ul[data-type="todoList"] li[data-type="taskItem"]`
  );

  todoItems.forEach(listItem => {
    const isChecked = listItem.getAttribute("data-checked") === "true";
    const checkbox = listItem.querySelector('input[type="checkbox"]');

    if (checkbox) {
      checkbox.checked = isChecked;

      if (isChecked) {
        checkbox.setAttribute("checked", "checked");
      } else {
        checkbox.removeAttribute("checked");
      }
    }
  });
};
