# redux-script

## after install add 
"redux-script": "node script.js"
to your script

to generate code files for async API calls and Redux store slices based on the provided titles. Let's break down the code and describe its function:


The script accepts command-line arguments to determine its behavior. It expects two arguments:

The first argument specifies the desired action. It can be "--all" to run both functions (asyncApis and reduxStore), "--api" to run asyncApis only, or "--store" to run reduxStore only.
The second argument provides a comma-separated list of titles for file generation.
If an invalid command or no titles are provided, the script displays an error message and exits.

The script defines several code templates for generating async API-related code and Redux store code.

The asyncApis function generates code files for async API calls based on the provided titles:

For each title, it creates a file with the title as the name (e.g., "SomeTitle.js").
The file includes code templates for creating async thunk functions for CRUD operations (create, update, get, delete) related to the specified title.
The generated code includes API endpoints, error handling, and dispatching of relevant actions.
The reduxStore function generates code files for Redux store slices based on the provided titles:

For each title, it creates a file with the title converted to lowercase as the name (e.g., "sometitle.js").
The file includes code templates for defining a Redux store slice with initial state, reducers, and extra reducers for async API actions related to the specified title.
The writeFile function is a helper function used to write the generated code to the appropriate file. It handles file creation or replacement depending on whether the file already exists.

The createFolderIfNotExists function is another helper function used to create necessary folders for the generated files.

The createFoldersAndFiles function is the main entry point of the script:

It checks the provided command and executes the corresponding functions (asyncApis, reduxStore, or both) based on the command-line arguments.
It also handles folder creation and displays success or error messages for each generated file.
Overall, this script provides a convenient way to generate code files for async API calls and Redux store slices based on the provided titles. It automates the process of creating boilerplate code for common operations and can save time when setting up API integration and Redux state management in a project
