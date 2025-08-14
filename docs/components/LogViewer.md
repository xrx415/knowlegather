# 📝 LogViewer Component Documentation

## Overview

**LogViewer** is a built-in developer console component designed to display application logs (info, errors, warnings, debug) directly within the user interface.

### Key Features

- **Live Debugging**: Allows real-time monitoring of application events and state changes without needing to open the browser's developer tools.
- **User-Friendly Interface**: Provides a clear, scrollable view of all console output, accessible to administrators or QA testers who may not be developers.
- **Error Reporting**: Simplifies bug reporting by allowing users to easily copy the entire log history for a session and share it with the development team.
- **Production Insight**: Can be invaluable in a production environment for diagnosing live issues that are difficult to reproduce in a development setting.

### How It Works

- The component overrides the standard `console.log`, `console.error`, `console.warn`, and `console.debug` methods.
- When any of these methods are called anywhere in the application, the LogViewer intercepts the output and renders it in its UI.
- It preserves the original console functionality, so logs still appear in the browser's console as usual.

### Use Cases

- **Development**: Quickly see the flow of data and events without switching to the browser console.
- **Staging/QA**: Allow testers to identify and report issues with detailed context.
- **Production**: (When enabled for admins) Provide immediate insight into live application issues, helping to debug problems that only occur in the production environment.

### How to Access

- The LogViewer is typically accessed via a **Terminal** icon in the `Navbar`.
- It can be conditionally rendered based on the user's role (e.g., only for admins) or the application's environment (e.g., hidden in production for regular users).
