const CharacterCountWrapper = ({ editor, children }) => {
  if (!editor) return children;

  return (
    <>
      {children}
      <p
        className="neeto-editor-character-count"
        data-testid="neeto-editor-character-count"
      >
        {editor.storage.characterCount.characters()} characters
      </p>
    </>
  );
};

export default CharacterCountWrapper;
