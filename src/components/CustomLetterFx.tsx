import React from "react";
import styles from "./CustomLetterFx.module.scss";

interface CustomLetterFxProps {
  children: React.ReactNode;
  delay?: number; // initial delay in seconds
  duration?: number; // animation duration in seconds
}

const CustomLetterFx: React.FC<CustomLetterFxProps> = ({
  children,
  delay = 0,
  duration = 0.5,
}) => {
  // Flatten children and extract text content
  let text = "";
  React.Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      text += child;
    }
  });
  const letters = text.split("");
  return (
    <span>
      {letters.map((char, index) => (
        <span
          key={index}
          className={styles.letter}
          style={{
            animationDelay: `${delay + index * 0.05}s`,
            animationDuration: `${duration}s`,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default CustomLetterFx;
