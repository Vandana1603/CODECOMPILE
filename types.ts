export enum Language {
    JavaScript = 'javascript',
    Python = 'python',
    Java = 'java',
    HTML = 'html',
    CSS = 'css',
    C = 'c',
    CPP = 'cpp',
    R = 'r',
}

export type CompilationResult = {
    type: 'success' | 'error';
    message: string;
}

export type Correction = {
    correctedCode: string;
    explanation: string;
}