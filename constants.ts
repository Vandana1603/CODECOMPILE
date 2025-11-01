import { Language } from './types';

export const sampleCode: Record<Language, string> = {
    [Language.JavaScript]: `// Welcome to JavaScript!
// This is a correct example. Try running it.
console.log("Hello from JavaScript!");

// Now, try this incorrect example to see AI correction.
// consl.log("This will cause an error");
`,
    [Language.Python]: `# Welcome to Python!
# This is a correct example. Try running it.
print("Hello from Python!")

# Now, try this incorrect example to see AI correction.
# print "This will cause an error in Python 3"
`,
    [Language.Java]: `// Welcome to Java!
// Note: For simplicity, this playground executes a single main method.
class HelloWorld {
    public static void main(String[] args) {
        // This is a correct example. Try running it.
        System.out.println("Hello from Java!");

        // Now, try this incorrect example to see AI correction.
        // System.out.println("This will cause an error);
    }
}
`,
    [Language.HTML]: `<!-- Welcome to HTML! -->
<!-- This is a correct example. Try running it. -->
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello from HTML!</h1>
    <p>This is a paragraph.</p>

    <!-- Now, try this incorrect example to see AI correction. -->
    <!-- <h1>Hello without a closing tag -->
</body>
</html>
`,
    [Language.CSS]: `/* Welcome to CSS! */
/* This is a correct example. */
body {
    font-family: sans-serif;
    background-color: #f0f0f0;
    color: #333;
}

h1 {
    color: navy;
}

/* Now, try this incorrect example to see AI correction. */
/*
p {
    color: red;
    font-size: 16px
}
*/
`,
    [Language.C]: `// Welcome to C!
#include <stdio.h>

int main() {
    // This is a correct example. Try running it.
    printf("Hello from C!\\n");

    // Now, try this incorrect example to see AI correction.
    // print("This will cause an error");
    return 0;
}
`,
    [Language.CPP]: `// Welcome to C++!
#include <iostream>

int main() {
    // This is a correct example. Try running it.
    std::cout << "Hello from C++!";

    // Now, try this incorrect example to see AI correction.
    // cout << "This will cause an error";
    return 0;
}
`,
    [Language.R]: `# Welcome to R!
# This is a correct example. Try running it.
print("Hello from R!")

# Now, try this incorrect example to see AI correction.
# prin("This will cause an error")
`,
};