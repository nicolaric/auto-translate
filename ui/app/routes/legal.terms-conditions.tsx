import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [
  {
    title: "Terms and Conditions - Auto Translate",
  },
];

export default function Terms() {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <a href="/" className="flex items-center space-x-2">
            <div className="bg-white h-10 w-10 rounded-full overflow-hidden flex justify-center items-center">
              <img src="/logo.png" alt="Auto Translate logo" />
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
      </header>
      <main className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-md mt-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Terms and Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Last updated: November 12th 2024
        </p>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            1. Introduction
          </h2>
          <p className="mt-2">
            Welcome to Auto Translate! These Terms and Conditions
            (&quot;Terms&quot;) govern your use of our service, which provides
            AI-driven language translation services specifically for
            application-related texts. By accessing or using our services, you
            agree to comply with these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            2. Services
          </h2>
          <p className="mt-2">
            Auto Translate offers translation services aimed at facilitating
            language translation within applications. All services are provided
            on a monthly billing basis and are usage-based. Currently, we do not
            offer a free trial, although this may be added in the future.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            3. Account Creation and Security
          </h2>
          <p className="mt-2">
            To access our services, you are required to create an account. You
            are responsible for maintaining the confidentiality of your account
            credentials and for all activities that occur under your account.
            Please notify us immediately of any unauthorized access or use of
            your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            4. Usage of the Service
          </h2>
          <p className="mt-2">
            Auto Translate must be used only for its intended purpose of
            translating applications. Users are expected to adhere to these
            Terms and use the service in a lawful manner. Misuse of the service
            or using it for purposes other than those permitted may result in
            the termination of your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            5. Payment and Billing
          </h2>
          <p className="mt-2">
            Billing for Auto Translate services is conducted on a monthly basis,
            based on the volume of translations processed. By subscribing to our
            service, you agree to pay all applicable fees. Fees may change over
            time, but users will be notified of any changes in advance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            6. Service Availability
          </h2>
          <p className="mt-2">
            Auto Translate strives to maintain a 99.9% uptime for our services.
            However, occasional interruptions may occur due to maintenance or
            unforeseen technical issues. While we aim to restore services as
            promptly as possible, we are not liable for any downtime.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            7. Limitation of Liability
          </h2>
          <p className="mt-2">
            Auto Translate provides translations based on AI technology and
            strives for accuracy. However, we make no warranties or guarantees
            regarding the completeness, accuracy, or reliability of the
            translations provided. To the maximum extent permitted by law, Auto
            Translate shall not be liable for any errors in translation or for
            any losses or damages resulting from the use of our service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            8. Privacy and Cookies
          </h2>
          <p className="mt-2">
            Auto Translate respects your privacy. Please refer to our{" "}
            <a
              href="/legal/privacy-policy"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </a>{" "}
            for details on how we handle your personal information. Note that
            third-party cookies, such as those from Google for login purposes,
            may be used on our site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            9. Termination of Service
          </h2>
          <p className="mt-2">
            We reserve the right to suspend or terminate your access to Auto
            Translate if you breach these Terms or engage in any unlawful
            activities through our service. You may also terminate your account
            at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            10. Governing Law
          </h2>
          <p className="mt-2">
            These Terms are governed by and construed in accordance with the
            laws of Switzerland. By using our services, you agree to submit to
            the exclusive jurisdiction of the courts in Switzerland for any
            disputes arising from or relating to these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            11. Amendments
          </h2>
          <p className="mt-2">
            Auto Translate reserves the right to update or modify these Terms at
            any time. If changes are made, we will provide notice through the
            website or via email. Continued use of the service after any changes
            are made constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 mt-6">
            Contact Us
          </h2>
          <p className="mt-2">
            If you have any questions or concerns about these Terms, please
            contact us at{" "}
            <a
              href="mailto:info@auto-translate.com"
              className="text-blue-600 hover:underline"
            >
              info@auto-translate.com
            </a>
            .
          </p>
        </section>
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
