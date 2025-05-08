
This project is a web-based payment platform built using Next.js, TypeScript, and React. It allows users to accept and process cryptocurrency payments through various payment methods, including Bitcoin (BTC), Ethereum (ETH), and Litecoin (LTC).

Features
Quote Creation and Update: A quote can be created and updated with details such as payment method, amount due, and the available crypto options.

Currency Selection: Users can choose from supported cryptocurrencies Bitcoin (BTC), Ethereum (ETH), and Litecoin (LTC) to make payments.

Payment QR Code Generation: A unique QR code is generated for each payment to facilitate easy cryptocurrency transfers.

Countdown Timer: A countdown is displayed to show the remaining time for the payment.

Payment Confirmation: Users can confirm their payment through the platform.

Expired Payment: If the payment deadline expires, users are redirected to a page indicating that the payment details are no longer valid.

Tech Stack
Next.js: A React framework server-rendered web applications.

TypeScript: A superset of JavaScript for static typing.

Axios: A promise-based HTTP client for the browser and Node.js.

Tailwind CSS: A CSS framework for creating responsive designs.

React QR Code: a package for react that provides the QRCode component

BVNK API: For cryptocurrency payment processing.



Prerequisites:

To run this project locally, you'll need the following:

Node.js (Recommended version: 16.x or higher)

Navigate into the project folder: 
Open the main folder ASSESS_TEST_BVNK and navigate to the project folder hpp-app
cd ASSESS_TEST_BVNK
cd hpp-app

Install dependencies:
npm install

Afte installation of dependencies, you can run the app:
npm run dev

The application will be available on your browser at http://localhost:3000.

Testing the App:

Create a Quote:
Navigate to http://localhost:3000/payin/[uuid] page.

The quote will be automatically fetched and displayed.

Select a Currency:
Use the dropdown to select one of the available cryptocurrencies: BTC, ETH, or LTC.

The amount due should update accordingly.

Confirm Payment:
Click the Confirm button to proceed with payment.

You will be redirected to the Pay page, where you can view the payment QR code. 
You can also copy the Amount due, as well as the BTC address here

Expired Payment:
If the payment expires, you will be redirected to the Expired page with a notification.

Thank you for your time, and I hope you enjoy the app :)