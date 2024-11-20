import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { generateAuthUrl } from "~/lib/oauth-providers/google";
import { logEvent } from "~/lib/utils/logs";

export const meta = () => {
  return [
    { charset: "utf-8" },
    { title: "AI-Powered App Translation with Auto Translate" },
    {
      description:
        "Translate your app's language files automatically with AI. Supports over 30 languages, integrates with CI pipelines, and simplifies your translation process.",
    },
    { viewport: "width=device-width,initial-scale=1" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Put "register" in the state so we know where the user is
  // coming from when they are sent back to us from Google.
  logEvent("page_view", { page: "index" });

  return Response.json({
    googleAuthUrl: generateAuthUrl(""),
  });
}

export default function Index() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  const [commandText] = useState(
    "auto-translate --source-file=en.json --source-language=en --target-file=de.json --target-language=de"
  );
  const [typedCommand, setTypedCommand] = useState("");

  /*useEffect(() => {
                                          let i = 0;
                                          const typeCommand = () => {
                                              if (i < commandText.length) {
                                                  setTypedCommand((prev) => prev + commandText.charAt(i));
                                                  i++;
                                                  setTimeout(typeCommand, 50);
                                              }
                                          };
                                          typeCommand();
                                      }, [commandText]);*/

  return (
    <div>
      <main className="bg-gray-50 text-gray-800">
        {/* Header Section */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center px-6">
            <a href="." className="flex items-center space-x-2">
              <div className="bg-white h-10 w-10 rounded-full overflow-hidden flex justify-center items-center">
                <img src="/logo-small.png" alt="Auto Translate logo" />
              </div>
              <div className="text-2xl font-bold">Auto Translate</div>
            </a>
            <nav className="space-x-6 text-lg font-medium hidden md:inline-block">
              <a href="#how-it-works" className="hover:underline">
                How It Works
              </a>
              <a href="#upcoming-features" className="hover:underline">
                Upcoming Features
              </a>
              <a href="#faq" className="hover:underline">
                FAQ
              </a>
            </nav>
          </div>
        </header>

        {/* Title Section */}
        <section className="text-center py-20 bg-gradient-to-b from-indigo-100 to-white">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Application translations, <br />
            <span className="text-blue-600">automated with AI</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            Effortlessly translate your app’s language files into multiple
            languages.
          </p>
        </section>

        {/* Google Sign-In */}
        <div className="flex justify-center mt-8">
          <a
            href={googleAuthUrl}
            className="flex items-center justify-center bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          >
            <img
              src="/google-logo.svg"
              alt="Google logo"
              className="w-5 h-5 mr-3 filter invert"
            />
            Continue with Google Sign-In
          </a>
        </div>
        {/* Terminal */}
        <div className="mt-10 mx-auto max-w-4xl bg-gray-800 text-white rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-t-lg">
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
            <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </div>
          <div className="p-6">
            <pre className="text-lg font-mono overflow-x-auto">
              <code>
                auto-translate --source-file=en.json --source-language=en
                --target-file=de.json --target-language=de
              </code>
            </pre>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose Auto Translate?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Feature
                icon="🛠️"
                title="Automatic Translation"
                description="Simplifies the entire translation process for your app."
              />
              <Feature
                icon="🌍"
                title="Multi-language Support"
                description="Supports over 30 languages worldwide."
              />
              <Feature
                icon="🔗"
                title="CI Pipeline Integration"
                description="Easily runs in the CI Pipeline for full automation."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 text-center mt-4 mb-8">
              Follow these four simple steps to translate your app effortlessly.
            </p>
            <Steps />
          </div>
        </section>

        <section id="upcoming-features" className="py-20 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Upcoming Features
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Exciting new updates and features are on the way to enhance your
              experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                status="Planned"
                title="Direct GitLab/GitHub Pipeline Integration"
                description="No need to write your own pipeline definition files. We can do it for you directly."
              />
              <FeatureCard
                status="Planned"
                title="Improve Translation of Edited Values"
                description="We will not just find new values to translate, but also improve the translation of values that have been edited."
              />
              <FeatureCard
                status="Planned"
                title="App-Specific Translations"
                description="We understand that every application can have specific translations by its usage. Add those easily in your account, and we will ensure that we translate those correctly."
              />
              <FeatureCard
                status="Planned"
                title="Login with Email"
                description="You don't have a Google account? No worries, we will soon support simple Email login."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <FAQ />
          </div>
        </section>
      </main>
      <footer className="bg-white shadow-md mt-4 py-4">
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

function Feature({ icon, title, description }) {
  return (
    <div className="text-center p-6 bg-white shadow-md rounded-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Steps() {
  const steps = [
    {
      icon: "💼",
      title: "Step 1: Create a Subscription",
      description: "Sign up for an Auto Translate subscription to get started.",
    },
    {
      icon: "🗣️",
      title: "Step 2: Download the NPM package",
      description:
        'Install <a class="text-blue-600" href="https://www.npmjs.com/package/@auto-translate/cli" target="_blank">@auto-translate/cli</a> to start translating.',
    },
    {
      icon: "🚀",
      title: "Step 3: Run the translation script",
      description:
        "Let AI automatically translate your content into the selected languages.",
    },
    {
      icon: "👀",
      title: "Step 4: Review and merge changes",
      description:
        "Review translations and merge them into your app for a seamless integration.",
    },
  ];
  return steps.map((step, index) => (
    <div key={index} className="mb-6 text-center">
      <div className="text-4xl mb-2">{step.icon}</div>
      <h3 className="text-lg font-semibold">{step.title}</h3>
      <p
        className="text-gray-600"
        dangerouslySetInnerHTML={{ __html: step.description }}
      ></p>
    </div>
  ));
}

function FeatureCard({ status, title, description }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <div
          className={`h-4 w-4 rounded-full ${
            status === "Planned" ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <span className="text-blue-600 font-medium">{status}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "My file is only translated partly, what should I do?",
      answer:
        "This can happen due to various reasons. Just run the translation command again.",
    },
    {
      question: "How do I run Auto Translate in my CI/CD pipeline?",
      answer: (
        <>
          To run Auto Translate in your CI/CD pipeline, you can use the
          following GitLab CI configuration:
          <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto mt-4">
            <code className="text-xs">
              {`build-job:
  image: node:latest
  stage: build
  before_script:
    - git config --global user.name "\${GITLAB_USER_NAME}"
    - git config --global user.email "\${GITLAB_USER_EMAIL}"
  script: |
    npx @auto-translate/cli --source-file ./en.json --source-language en --target-file ./de.json --target-language de
    git config --global user.email "ci@example.com"  # Set a default user email
    git config --global user.name "CI Bot"          # Set a default user name
    
    # Use HTTPS with the access token for authentication
    git checkout -b feature-branch-name  # Replace with your branch name
    git add .  # Stage all changes
    git commit -m "Automated commit from GitLab CI/CD" || echo "No changes to commit"
    
    # Push changes using HTTPS and the Personal Access Token
    git push https://oauth2:$GITLAB_ACCESS_TOKEN@gitlab.com/$CI_PROJECT_PATH.git feature-branch-name
    # Variables
    PROJECT_ID=$CI_PROJECT_ID
    SOURCE_BRANCH="feature-branch-name"  # Replace with your branch name
    TARGET_BRANCH="main"
    TITLE="Automated Merge Request from CI/CD"
    DESCRIPTION="This MR is generated by the GitLab CI/CD pipeline."

    # Create Merge Request using GitLab API
    curl --request POST --header "PRIVATE-TOKEN: $GITLAB_ACCESS_TOKEN" \
      --data "source_branch=$SOURCE_BRANCH" \
      --data "target_branch=$TARGET_BRANCH" \
      --data "title=$TITLE" \
      --data "description=$DESCRIPTION" \
      "https://gitlab.com/api/v4/projects/$PROJECT_ID/merge_requests"`}
            </code>
          </pre>
        </>
      ),
    },
  ];
  return faqs.map((faq, index) => (
    <div key={index} className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
      <p className="text-gray-600">{faq.answer}</p>
    </div>
  ));
}
