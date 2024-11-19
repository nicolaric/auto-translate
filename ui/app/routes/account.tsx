import type { MetaFunction } from "@remix-run/node";
import { NavLink, Outlet, redirect, useLoaderData } from "@remix-run/react";
import { commitSession } from "~/lib/sessions/sessions";
import { requireUserSession } from "~/lib/utils/auth.server";
import * as gtag from "~/lib/utils/gtag.client";

export const meta: MetaFunction = () => {
  return [
    { title: "Account - Auto Translate" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({
  request,
}: {
  request: Request;
}): Promise<Response> => {
  const session = await requireUserSession(request);

  const loadPaymentStatus = async () => {
    const paymentStatusReq = await fetch(
      "https://auto-translate.com/api/payment/status",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.get("token")}`,
        },
      }
    );
    const res = await paymentStatusReq.json();
    return res;
  };

  let paymentStatus = await loadPaymentStatus();

  if (!paymentStatus.data?.length && !paymentStatus.freeTier) {
    const res = await fetch(
      "https://auto-translate.com/api/payment/free-tier",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.get("token")}`,
        },
        body: JSON.stringify({}),
      }
    );

    await res.json();
    paymentStatus = await loadPaymentStatus();
  }

  const url = new URL(request.url);
  if (url.pathname === "/account") {
    return redirect("/account/api-keys");
  }

  return Response.json(
    { paymentStatus },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function Account() {
  const { paymentStatus } = useLoaderData() as {
    paymentStatus: any;
  };

  /**gtag.event("conversion", {
      send_to: "AW-1003296964/bVXlCP-z5OYZEMSxtN4D",
      value: 0.1,
      currency: "CHF",
    });*/

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <a href="." className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="/logo.png" alt="Auto Translate" />
          </div>
          <span className="text-xl font-bold">Auto Translate</span>
        </a>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 mb-2">
        <h1 className="text-3xl font-bold text-center mb-6">Your Account</h1>

        <div className="bg-blue-100 p-4 text-blue-900 rounded-md mb-6">
          <b>How to Use This Service</b>
          <ol>
            <li>
              1. Create an API Key using the{" "}
              <strong>+ Create New API Key</strong> button on this page and copy
              it.
            </li>
            <li>
              2. Create the environment variable
              &quot;AUTO_TRANSLATE_API_KEY&quot; on your computer and set it to
              your copied API key.
            </li>
            <li>
              3. Run the following command locally to translate files:
              <pre className="bg-gray-100 p-2.5 rounded-md overflow-x-auto">
                npx @auto-translate/cli --source-file en.json --source-language
                en --target-file de.json --target-language de
              </pre>
            </li>
          </ol>
          <p className="text-gray-500">
            Replace <code>en.json</code> and <code>de.json</code> with your
            actual file names and languages.
          </p>
        </div>

        {!paymentStatus.data?.length && (
          <div className="bg-yellow-100 p-4 text-yellow-900 rounded-md text-center mb-6">
            You are still on the limited free plan. Consider switching to a paid
            plan to continue using the service.{" "}
            <a href="/pricing" className="text-blue-600">
              View pricing
            </a>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <NavLink
            to={{
              pathname: "./api-keys",
            }}
            className={({ isActive }) =>
              `block text-white px-4 py-2 rounded-md mb-4 ${
                isActive ? "bg-blue-900" : "bg-blue-600"
              }`
            }
          >
            API Keys
          </NavLink>
          <NavLink
            to={{
              pathname: "./usage",
            }}
            className={({ isActive }) =>
              `block text-white px-4 py-2 rounded-md mb-4 ${
                isActive ? "bg-blue-900" : "bg-blue-600"
              }`
            }
          >
            Usage and Subscription
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
