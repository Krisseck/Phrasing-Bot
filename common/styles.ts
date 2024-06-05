export interface Style {
    name: string,
    content: string
}

export interface StyleCollection {
    [style_key: string]: Style
}

export const styles = {
    NATURAL: {
        name: "Natural",
        content: "fluent and natural"
    },
    PROFESSIONAL: {
        name: "Professional",
        content: "professional and formal"
    },
    SIMPLE: {
        name: "Simple",
        content: "simple and easy to read"
    }
} as StyleCollection
