import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [
  {
    title: "Imprint - Auto Translate",
  },
];

export default function Imprint() {
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
      </header>{" "}
      <main className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-md mt-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Imprint</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-600">
              Company Name:
            </h2>
            <p>Auto Translate</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-600">Address:</h2>
            <p>
              Nicola Richli
              <br />
              Unterdorf 7b
              <br />
              5073 Gipf-Oberfrick
              <br />
              Switzerland
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-600">
              Contact Information:
            </h2>
            <p>
              Email:{" "}
              <a
                href="mailto:info@auto-translate.com"
                className="text-blue-600 hover:underline"
              >
                info@auto-translate.com
              </a>
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-600">
              Represented by:
            </h2>
            <p>Nicola Richli</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-600">Disclaimer:</h2>
            <p>
              While we strive to ensure the information on this website is
              accurate, we do not guarantee its completeness or relevance to
              specific circumstances. The content is provided for informational
              purposes only and is not intended as a substitute for personalized
              professional advice.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-600">Legal Note:</h2>
            <p>
              Auto Translate is not responsible for the content of external
              links. The operators of linked pages are solely responsible for
              their content.
            </p>
          </section>
        </div>
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
