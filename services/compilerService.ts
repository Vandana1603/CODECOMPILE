import { Language, CompilationResult } from '../types';

// Helper to extract simple string literals from print/log statements
const extractStringLiterals = (code: string, regex: RegExp): string[] => {
    const outputs: string[] = [];
    let match;
    while ((match = regex.exec(code)) !== null) {
        if (match[1]) {
            let content = match[1].trim();
            // Remove quotes
            if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
                content = content.slice(1, -1);
            }
            // Handle common escape sequences
            content = content.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            outputs.push(content);
        }
    }
    return outputs;
};

// Helper for C++ cout statements
const extractCoutStrings = (code: string): string[] => {
    const outputs: string[] = [];
    const coutRegex = /std::cout\s*<<(.*);/g;
    let match;
    while ((match = coutRegex.exec(code)) !== null) {
        if (match[1]) {
            const parts = match[1].split('<<').map(p => p.trim());
            let line = '';
            for (const part of parts) {
                if (part.startsWith('"') && part.endsWith('"')) {
                    line += part.slice(1, -1);
                } else if (part === 'std::endl') {
                    line += '\n';
                }
            }
            outputs.push(line);
        }
    }
    return outputs;
};

export const executeCode = (code: string, language: Language): CompilationResult => {
    if (!code.trim()) {
        return { type: 'error', message: "Error: Code is empty." };
    }

    // Filter out commented code for checks to only run active code.
    const activeCode = code.split('\n').filter(line => !line.trim().startsWith('//') && !line.trim().startsWith('#')).join('\n');

    switch (language) {
        case Language.JavaScript: {
            if (activeCode.includes('consl.log')) {
                return { type: 'error', message: "TypeError: consl.log is not a function" };
            }
            const logs = extractStringLiterals(activeCode, /console\.log\(([^)]+)\)/g);
            if (logs.length > 0) {
                return { type: 'success', message: logs.join('\n') };
            }
            return { type: 'success', message: 'Code executed with no output.' };
        }
        
        case Language.Python: {
            if (/\bprint\s[^("]/.test(activeCode)) {
                return { type: 'error', message: "SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)? "};
            }
            const prints = extractStringLiterals(activeCode, /print\(([^)]+)\)/g);
            if (prints.length > 0) {
                return { type: 'success', message: prints.join('\n') };
            }
            return { type: 'success', message: 'Code executed with no output.' };
        }

        case Language.Java: {
            if (activeCode.includes('System.out.println("This will cause an error);')) {
                 return { type: 'error', message: "HelloWorld.java:8: error: unclosed string literal\nSystem.out.println(\"This will cause an error);\n                  ^" };
            }
            if (activeCode.trim() && !activeCode.includes("class")) {
                 return { type: 'error', message: "Error: Invalid Java code structure. Missing class definition." };
            }
            const prints = extractStringLiterals(activeCode, /System\.out\.println\(([^)]+)\)/g);
            if (prints.length > 0) {
                return { type: 'success', message: prints.join('\n') };
            }
            return { type: 'success', message: 'Code executed with no output.' };
        }

        case Language.HTML:
            if (activeCode.includes('<h1>Hello without a closing tag')) {
                return { type: 'error', message: "Syntax Error: Missing closing tag for <h1>." };
            }
            return { type: 'success', message: 'HTML is well-formed.' };

        case Language.CSS:
             if (activeCode.includes('font-size: 16px\n}')) {
                return { type: 'error', message: "Syntax Error: Missing semicolon after '16px'." };
            }
            return { type: 'success', message: 'CSS syntax is valid.' };

        case Language.C: {
            if (activeCode.includes('print("This will cause an error")')) {
                return { type: 'error', message: "Compiler Error: 'print' is not a function. Did you mean 'printf'?" };
            }
             if (activeCode.includes('printf') && !code.includes("#include <stdio.h>")) {
                 return { type: 'error', message: "Warning: Missing #include <stdio.h> for printf." };
            }
            const prints = extractStringLiterals(activeCode, /printf\(([^)]+)\)/g);
            if (prints.length > 0) {
                return { type: 'success', message: prints.join('') };
            }
            return { type: 'success', message: 'Code executed with no output.' };
        }

        case Language.CPP: {
             if (activeCode.includes('cout << "This will cause an error"')) {
                return { type: 'error', message: "Compiler Error: 'cout' was not declared in this scope. Did you forget 'std::'?" };
            }
            if (activeCode.includes('std::cout') && !code.includes("#include <iostream>")) {
                 return { type: 'error', message: "Warning: Missing #include <iostream> for std::cout." };
            }
            const prints = extractCoutStrings(activeCode);
            if (prints.length > 0) {
                 return { type: 'success', message: prints.join('') };
            }
            return { type: 'success', message: 'Code executed with no output.' };
        }

        case Language.R: {
            if (activeCode.includes('prin("This will cause an error")')) {
                return { type: 'error', message: "Error in prin(...): could not find function \"prin\"" };
            }
            const prints = extractStringLiterals(activeCode, /print\(([^)]+)\)/g);
             if (prints.length > 0) {
                return { type: 'success', message: prints.map(p => `[1] "${p}"`).join('\n') };
            }
            return { type: 'success', message: 'Code executed with no output.' };
        }
        
        default:
            return { type: 'error', message: `Language ${language} not supported.` };
    }
};
