import React, { useState, useEffect, useRef } from "react";

interface TagInputProps {
  id: string;
  value: string[]; // Accept value as an array of strings
  onChange: (tags: string[]) => void; // Accept onChange as a function that updates an array of strings
}

const TagInput: React.FC<TagInputProps> = ({ id, value, onChange }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    if (inputValue.trim() !== "") {
      const newTag = inputValue.trim();
      onChange([...value, newTag]); // Add the new tag (string) to the array
      setInputValue(""); // Clear the input field after adding the tag
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags); // Update tags state using onChange prop
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    } else if (event.key === "Backspace" && inputValue === "") {
      removeTag(value.length - 1);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [value]);

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-white">
        Tag Input
      </label>
      <div className="flex flex-wrap min-h-12 rounded-lg border-[1.5px] items-center ">
        {value.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-1 mr-2 mb-1 mt-1"
          >
            <span>{tag}</span> {/* Directly display the tag (string) */}
            <button
              onClick={() => removeTag(index)}
              className="ml-2 focus:outline-none"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          placeholder="Add a tag"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-auto  bg-transparent outline-none px-3 py-1"
        />
      </div>
    </div>
  );
};

export default TagInput;
