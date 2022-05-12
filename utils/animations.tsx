import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import Variants from "../models/variants";

type IndexedItem = { index: number };
type ListItemParams = PropsWithChildren<IndexedItem> &
  Pick<React.HTMLAttributes<HTMLLIElement>, "className">;

export function ListItemSlideIn({
  children,
  index,
  className,
}: ListItemParams) {
  return (
    <motion.li
      key={index}
      custom={index}
      animate="visible"
      variants={Variants.delayedSlideIn}
      className={className}
    >
      {children}
    </motion.li>
  );
}

export function ListItemZoom({
  children,
  index,
  className,
}: ListItemParams) {
  return (
    <motion.li
      key={index}
      custom={index}
      animate="visible"
      variants={Variants.delayedZoomIn}
      className={className}
    >
      {children}
    </motion.li>
  );
}
