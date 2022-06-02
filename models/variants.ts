const delayedSlideIn = {
    visible: (idx: number) => ({
        x: ["-150%", "15%", "0%"],
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