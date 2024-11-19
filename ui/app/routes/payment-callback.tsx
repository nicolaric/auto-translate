import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { commitSession } from "~/lib/sessions/sessions";
import { requireUserSession } from "~/lib/utils/auth.server";
import * as gtag from "~/lib/utils/gtag.client";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  if (!session.has("token")) {
    return redirect("/");
  }

  const paymentRequest = await fetch(
    "https://auto-translate.com/api/payment/status",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.get("token")}`,
      },
    }
  );

  const paymentInfo = await paymentRequest.json();

  return Response.json(
    {
      token: session.get("token") as string,
      paymentSuccess: paymentInfo.data.length > 0,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

// This component should never get rendered, so it can be anything
export default function PaymentCallback() {
  const { paymentSuccess } = useLoaderData() as {
    token: string;
    paymentSuccess: boolean;
  };

  gtag.event("conversion", {
    send_to: "AW-1003296964/bVXlCP-z5OYZEMSxtN4D",
    value: 10,
    currency: "CHF",
  });

  return (
    <div>
      {paymentSuccess && (
        <div
          className="flex flex-col items-center justify-center p-4 space-y-4"
          id="status-success"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full">
            <svg
              fill="white"
              viewBox="0 0 1920 1920"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z"
                  fillRule="evenodd"
                ></path>
              </g>
            </svg>
          </div>
          <div className="text-center text-gray-700">
            <p>
              Payment successful, <br />
              go to your
              <a
                href="/account"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Account
              </a>
            </p>
          </div>
        </div>
      )}
      {!paymentSuccess && (
        <div
          className="flex flex-col items-center justify-center p-4 space-y-4"
          id="status-error"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-full">
            <svg
              fill="white"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z"
                  fillRule="evenodd"
                ></path>
              </g>
            </svg>
          </div>
          <div className="text-center text-gray-700">
            <p>
              Payment failed, <br />
              go back to
              <a
                href="/pricing"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Pricing
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
