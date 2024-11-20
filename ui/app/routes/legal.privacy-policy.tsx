import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [
  {
    title: "Privacy Policy - Auto Translate",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <a href="/" className="flex items-center space-x-2">
            <div className="bg-white h-10 w-10 rounded-full overflow-hidden flex justify-center items-center">
              <img src="/logo-small.png" alt="Auto Translate logo" />
            </div>
            <div className="text-2xl font-bold">Auto Translate</div>
          </a>
          <nav className="space-x-6 text-lg font-medium hidden md:inline-block">
            <Link to="/#how-it-works" className="hover:underline">
              How It Works
            </Link>
            <Link to="/#upcoming-features" className="hover:underline">
              Upcoming Features
            </Link>
            <Link to="/#faq" className="hover:underline">
              FAQ
            </Link>
          </nav>
        </div>
      </header>{" "}
      <main className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-md mt-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Privacy Policy
        </h1>
        <p className="mb-4">
          Welcome to Auto Translate. We are committed to protecting your
          personal information and your right to privacy. This Privacy Policy
          describes the types of data we collect, how we use it, and the rights
          you have concerning your data.
        </p>

        <h2 className="text-lg font-semibold text-gray-600 mt-6">
          1. Information We Collect
        </h2>
        <p className="mt-2">
          We collect the following types of information when you use our
          service:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>User Email:</strong> Collected for account setup, login, and
            communication purposes.
          </li>
          <li>
            <strong>IP Address:</strong> Used for security and service
            improvement.
          </li>
          <li>
            <strong>Usage Data:</strong> Data on how you interact with our
            service, collected to help improve the functionality and user
            experience.
          </li>
        </ul>
        <p className="mt-2">
          Note: While we do not use cookies or other tracking technologies on
          our website, please be aware that Google may place a third-party
          cookie on your device when you interact with the Google sign-in
          button.
        </p>

        <h2 className="text-lg font-semibold text-gray-600 mt-6">
          2. How We Use Your Information
        </h2>
        <p className="mt-2">
          Your data is used to provide, maintain, and improve our service,
          including:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            Facilitating account registration, login, and billing through
            third-party services.
          </li>
          <li>
            Analyzing usage data to improve our services and user experience.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-600 mt-6">
          3. Sharing Your Information
        </h2>
        <p className="mt-2">
          We share your information only as necessary with trusted third-party
          service providers:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>Stripe:</strong> User email is shared with Stripe for
            billing and payment processing.
          </li>
          <li>
            <strong>Google:</strong> User email is shared with Google for login
            authentication. Please note that interacting with the Google sign-in
            button may result in Google placing a third-party cookie on your
            device.
          </li>
        </ul>
        <p className="mt-2">
          Users may be redirected to Google or Stripe as part of the login and
          billing processes. Please review the privacy policies of these
          third-party providers to understand how they handle your information.
        </p>

        <h2 className="text-lg font-semibold text-gray-600 mt-6">
          4. Your Rights
        </h2>
        <p className="mt-2">
          You have certain rights regarding the data we collect, including:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>Access to Data:</strong> You can request access to the
            personal data we hold about you.
          </li>
          <li>
            <strong>Data Deletion:</strong> You may request the deletion of your
            personal data at any time by contacting us.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-600 mt-6">
          5. Third-Party Service Providers
        </h2>
        <p className="mt-2">We utilize the following third-party services:</p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>Google:</strong> For account login and authentication.{" "}
            <a
              href="https://policies.google.com/privacy"
              className="text-blue-600 hover:underline"
            >
              Google’s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Stripe:</strong> For billing and payments.{" "}
            <a
              href="https://stripe.com/privacy"
              className="text-blue-600 hover:underline"
            >
              Stripe’s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>OpenAI:</strong> Used for generating translations. No
            personal data is shared with OpenAI.{" "}
            <a
              href="https://openai.com/policies/privacy-policy"
              className="text-blue-600 hover:underline"
            >
              OpenAI’s Privacy Policy
            </a>
            .
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-600 mt-6">
          6. International Data Transfers
        </h2>
        <p className="mt-2">
          We do not transfer personal data internationally.
        </p>

        <h2 className="text-lg font-semibold text-gray-600 mt-6">
          7. Age Requirements
        </h2>
        <p className="mt-2">
          Our service does not have a specific minimum age requirement; however,
          users under the age of 16 should seek parental consent before using
          our service.
        </p>

        <h2 className="text-lg font-semibold text-gray-600 mt-6">
          8. Contact Us
        </h2>
        <p className="mt-2">
          Email:{" "}
          <a
            href="mailto:info@auto-translate.com"
            className="text-blue-600 hover:underline"
          >
            info@auto-translate.com
          </a>
        </p>
        <p className="mt-2">
          Address: Nicola Richli, Unterdorf 7b, 5073 Gipf-Oberfrick, Switzerland
        </p>
        <p className="mt-2">
          This Privacy Policy was last updated on November 11th 2024.
        </p>
      </main>
      <footer className="bg-white shadow-md mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-6 text-gray-600">
          <a href="/legal/imprint" className="hover:text-blue-500">
            Imprint
          </a>
          <a href="/legal/privacy-policy" className="hover:text-blue-500">
            Privacy Policy
          </a>
          <a href="/legal/terms-conditions" className="hover:text-blue-500">
            Terms and Conditions
          </a>
        </div>
      </footer>
    </div>
  );
}
