export interface DataObject {
    /** JSON-Format for Database. */
    toJSON(): Record<string, any>;

    /**JSON-Format for LocalStroage. */
    toJSONLocal(): Record<string, any>;
}

