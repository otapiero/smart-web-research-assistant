# Smart Web Research Assistant

## Introduction
The **Smart Web Research Assistant** is a browser extension designed to enhance productivity by providing quick and concise explanations of selected text using OpenAI's API. With a simple selection of any text on a webpage, the assistant fetches explanations from OpenAI's models and displays them in a user-friendly popup interface.

> **Note:** This project is in the early stages of development and is primarily intended for study purposes. Future updates and improvements are expected as development progresses.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

## Features
- Select any text on a webpage and get a concise explanation via OpenAI's API.
- User-friendly popup interface that positions itself next to the selected text.
- Integrated settings for entering and managing your OpenAI API key.
- Simple to install and use with support for multiple web pages.

## Installation
1. Clone or download this repository.
2. Open your browser and navigate to the **Extensions** page.
   - In Chrome: Go to `chrome://extensions/`.
3. Enable **Developer Mode** by toggling the switch at the top-right corner.
4. Click on the "Load unpacked" button and select the directory where this project resides.
5. The extension will now be installed and available in your browser toolbar.

## Usage
1. Highlight any text on a webpage.
2. A popup will appear with an **Explain** button.
3. Click the **Explain** button to fetch an explanation of the selected text using OpenAI's GPT-4 model.
4. The explanation will be displayed inside the popup.

### Buttons:
- **Explain**: Initiates the API call to OpenAI for the selected text.
- **Settings**: Opens the configuration interface where the OpenAI API key can be entered.
- **Close**: Closes the popup.

## Configuration
- The extension requires an OpenAI API key to function. Upon first use, you will be prompted to enter your API key. This key is stored securely using the browser's local storage.
- To update or reset the API key, click on the **Settings** button in the popup.

## Dependencies
- **OpenAI API**: Used to generate explanations for the selected text.
- **Chrome Storage API**: Manages local storage for user settings (API key).
- **Web APIs**: DOM manipulation, event handling for capturing selected text, and positioning the popup.

## Troubleshooting
- **No Explanation Provided**: Ensure that the API key is correctly entered. You can reset the key by clicking the **Settings** button.
- **Popup Not Appearing**: If the popup doesn't appear after selecting text, ensure the extension is properly installed and enabled.

## Contributors
- [otapiero]

## License
This project is licensed under the MIT License.
