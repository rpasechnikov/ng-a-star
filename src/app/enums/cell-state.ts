/**Represents the state of an individual cell */
export enum CellState {
    // Grass
    Empty,

    // River
    Obstacle,

    PossiblePath,
    ConfirmedPath,
    Start,
    End,

    // Forest
    Forest,

    // Road
    Road
}
