/**Allows objects to be able to provide a hash of themselves */
export interface IHashable {
    /**Returns a hash to represent this object */
    getHash(): string;
}
