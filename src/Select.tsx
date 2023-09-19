import React, { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export type SelectedOption = {
  label: string;
  value: string | number;
};

type MultiSelectProps = {
  multiple: true;
  value: SelectedOption[];
  onChange: (value: SelectedOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectedOption;
  onChange: (value: SelectedOption | undefined) => void;
};

type SelectProps = {
  options: SelectedOption[];
} & (SingleSelectProps | MultiSelectProps);

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const clearOptions = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    multiple ? onChange([]) : onChange(undefined);
  };

  const selectOption = (option: SelectedOption) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }

    setIsOpen(false);
  };

  const isOptionSelected = (option: SelectedOption) => {
    return multiple ? value.includes(option) : option === value;
  };

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;

      switch (e.code) {
        case "Enter":
        case "Space": {
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        }

        case "ArrowUp":
        case "ArrowDown":
          {
            if (!isOpen) {
              setIsOpen(true);
              break;
            }

            const newValue =
              highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
            if (newValue >= 0 && newValue < options.length) {
              setHighlightedIndex(newValue);
            }
          }
          break;

        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);
  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      className={styles.container}
      tabIndex={0}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <span className={styles.value}>
        {multiple
          ? value.map((v) => (
              <button
                type="button"
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className={styles["option-badge"]}
              >
                {v.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        type="button"
        className={styles["clear-btn"]}
        onClick={(e) => clearOptions(e)}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>

      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            key={option.value}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            }
            ${index === highlightedIndex ? styles.highlightedIndex : ""}
            `}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
