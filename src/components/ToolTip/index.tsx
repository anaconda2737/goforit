import { ComponentProps, ReactNode, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import styles from "./ToolTip.module.scss";

type ToolTipProps = {
  container?: HTMLElement;
  selector: string;
  children: ReactNode;
} & ComponentProps<"div">;

const ToolTip = ({ selector, children, className, ...props }: ToolTipProps) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  let [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  let [isOpen, setIsOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const { attributes, styles: style } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "top",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  const show = () => {
    setIsOpen(true);
  };

  const hide = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (selector.length === 0) return;

    let element = document.querySelector(selector) as HTMLElement;

    if (!element) return;

    element.addEventListener("mouseenter", show);
    element.addEventListener("mouseleave", hide);
    setReferenceElement(element);

    return () => {
      element.removeEventListener("mouseenter", show);
      element.removeEventListener("mouseleave", hide);
    };
  }, [selector]);

  if (!referenceElement) return null;

  return createPortal(
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={300}
      classNames={{
        enterActive: styles.enter,
        exitActive: styles.exit,
      }}
      unmountOnExit
    >
      <div
        ref={(node) => {
          setPopperElement(node);
          nodeRef.current = node;
        }}
        className={`${styles.container} ${className || ""}`.trim()}
        style={{
          ...style.popper,
        }}
        {...attributes.popper}
        {...props}
      >
        <div className={styles.menu}>{children}</div>
      </div>
    </CSSTransition>,
    document.body
  );
};

export default ToolTip;
