const delayedSlideIn = {
    visible: (idx: number) => ({
        x: ["-100%", "15%", "0%"],
        transition: {
            delay: idx * 0.1
        }
    })
};

const delayedZoomIn = {
    visible: (idx: number) => ({
        scale: [0, 1.2, 1],
        transition: {
            delay: idx * 0.1
        }
    })
};

const Variants = {
    delayedSlideIn,
    delayedZoomIn
}

export default Variants;