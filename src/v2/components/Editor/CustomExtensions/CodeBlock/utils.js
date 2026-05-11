export const handleCodeBlockVisibility = ({ entries, setIsVisible }) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setIsVisible(true);
      entry.target.style.visibility = "visible";
    } else {
      setIsVisible(false);
      entry.target.style.visibility = "hidden";
    }
  });
};
