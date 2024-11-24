import type { MetaFunction } from "@remix-run/node";
import { NavLink, Outlet, redirect, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { commitSession } from "~/lib/sessions/sessions";
import { requireUserSession } from "~/lib/utils/auth.server";
import * as gtag from "~/lib/utils/gtag.client";
import { ChartLineUp, Key, List, Translate } from "@phosphor-icons/react";

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
    return redirect("/account/translator");
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenuOpen = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gtag.event("conversion", {
        send_to: "AW-1003296964/bVXlCP-z5OYZEMSxtN4D",
        value: 0.1,
        currency: "CHF",
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gray-100 text-gray-900 p-4">
      {/* Header Section */}
      <div className="flex bg-gray-200 p-2 gap-4 rounded-xl flex-col sm:flex-row">
        <div className="w-60 sm:block hidden">
          <div className="w-12 h-12 m-auto mb-4">
            <img src="/logo-small.png" alt="Logo" />
          </div>
          <NavLink
            to={{
              pathname: "./translator",
            }}
            className={({ isActive }) =>
              `text-gray-700 px-4 py-1 rounded-md whitespace-nowrap flex items-center gap-2 ${
                isActive ? "bg-white shadow-md" : ""
              }`
            }
          >
            <Translate size={16} />
            <span>Translator</span>
          </NavLink>
          <NavLink
            to={{
              pathname: "./api-keys",
            }}
            className={({ isActive }) =>
              `text-gray-700 px-4 py-1 rounded-md whitespace-nowrap flex items-center gap-2 ${
                isActive ? "bg-white shadow-md" : ""
              }`
            }
          >
            <Key size={16} />
            <span>API Keys</span>
          </NavLink>
          <NavLink
            to={{
              pathname: "./usage",
            }}
            className={({ isActive }) =>
              `flex text-gray-700 px-4 py-1 rounded-md whitespace-nowrap items-center gap-2 ${
                isActive ? "bg-white shadow-md" : ""
              }`
            }
          >
            <ChartLineUp size={16} />
            <span>Usage</span>
          </NavLink>
        </div>
        <div className="block sm:hidden">
          <div className="flex justify-between w-full">
            <div className="w-12 h-12">
              <img src="/logo-small.png" alt="Logo" />
            </div>
            <button onClick={toggleMobileMenuOpen}>
              <List size={32} />
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="mt-4">
              {" "}
              <NavLink
                to={{
                  pathname: "./translator",
                }}
                className="flex items-center gap-2 text-gray-700 px-4 py-1 rounded-md whitespace-nowrap w-full"
              >
                <Translate size={16} />
                <span>Translator</span>
              </NavLink>
              <NavLink
                to={{
                  pathname: "./api-keys",
                }}
                className="flex items-center gap-2 text-gray-700 px-4 py-1 rounded-md whitespace-nowrap w-full"
              >
                <Key size={16} />
                <span>API Keys</span>
              </NavLink>
              <NavLink
                to={{
                  pathname: "./usage",
                }}
                className="w-full flex items-center gap-2 text-gray-700 px-4 py-1 rounded-md whitespace-nowrap"
              >
                <ChartLineUp size={16} />
                <span>Usage</span>
              </NavLink>
            </div>
          )}
        </div>
        {/* Main Content */}
        <div className="mx-auto p-8 bg-white rounded-xl w-full overflow-auto shadow-md">
          <div className="bg-blue-100 p-4 text-blue-900 rounded-md mb-6">
            <b>How to Use This Service</b>
            <ol>
              <li>
                1. Create an API Key using the{" "}
                <strong>+ Create New API Key</strong> button on this page and
                copy it.
              </li>
              <li>
                2. Create the environment variable
                &quot;AUTO_TRANSLATE_API_KEY&quot; on your computer and set it
                to your copied API key.
              </li>
              <li>
                3. Run the following command locally to translate files:
                <pre className="bg-gray-100 p-2.5 rounded-md overflow-x-auto">
                  npx @auto-translate/cli --source-file en.json
                  --source-language en --target-file de.json --target-language
                  de
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
              You are still on the limited free plan. Consider switching to a
              paid plan to continue using the service.{" "}
              <a href="/pricing" className="text-blue-600">
                View pricing
              </a>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
