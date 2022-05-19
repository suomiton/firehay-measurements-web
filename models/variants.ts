import { Keyframes } from "framer-motion";
import { TransformProperties } from "framer-motion/types/motion/types";
import { Transition, TransitionDefinition, Variant } from "framer-motion/types/types";

const delayedSlideIn = {
    visible: (idx: number) => ({
        x: ["-100%", "15%", "0%"],
        transition: {
            delay: idx * 0.2
        }
    })
};

const delayedZoomIn = {
    visible: (idx: number) => ({
        scale: [0, 1.05, 1],
        transition: {
            delay: idx * 0.2,
        }
    })
};

const Variants = {
    delayedSlideIn,
    delayedZoomIn
}

export default Variants;