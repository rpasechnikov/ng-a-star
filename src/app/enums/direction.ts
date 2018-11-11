export enum Direction {
    // Basic
    left,
    top,
    right,
    bottom,

    // Diagonal
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,

    // Quadrants
    topLeftQuadrant = left | top | topLeft,
    topRightQuadrant = top | right | topRight,
    bottomRightQuadrant = right | bottom | bottomRight,
    bottomLeftQuadrant = left | bottom | bottomLeft,

    // Sides
    allLeft = left | bottomLeft | topLeft,
    allTop = top | topLeft | topRight,
    allRight = right | topRight | bottomRight,
    allBottom = bottom | bottomRight | bottomLeft,

    // All
    all = top | bottom | allLeft | allRight
}
