import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/lib/utils/auth.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Pricing - Auto Translate" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader = async ({
    request,
}: {
    request: Request;
}): Promise<{ token: string; subscriptionActive: boolean }> => {
    const session = await requireUserSession(request);

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

    return {
        token: session.get("token") as string,
        subscriptionActive: !!paymentInfo.data?.length,
    };
};

export default function Pricing() {
    const { token, subscriptionActive } = useLoaderData() as {
        token: string;
        subscriptionActive: boolean;
    };

    const handleFreePlanClick = async () => {
        const res = await fetch(
            "https://auto-translate.com/api/payment/free-tier",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}),
            }
        );

        const data = await res.json();
        if (data.success) {
            window.location.href = "/account";
        }
    };

    const handleBasicPlanClick = async () => {
        const res = await fetch("https://auto-translate.com/api/payment/prepare", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center py-8">
            {/* Title Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Choose Your Plan
                </h1>
                <p className="mt-4 text-gray-600">
                    Select a pricing plan that best suits your app&apos;s translation
                    needs.
                </p>
            </div>

            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Free Plan */}
                {!subscriptionActive && (
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center border hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-2xl font-semibold text-blue-600">
                            Free Testing Plan (Active)
                        </h2>
                        <p className="text-gray-600 text-center mt-2">
                            Test our translation services with a limited number of words for
                            free.
                        </p>
                        <div className="mt-4 text-3xl font-bold text-gray-800">$0.00</div>
                        <p className="text-sm text-gray-500">/100 words</p>
                        <p className="mt-2 text-sm text-gray-600 text-center">
                            Single use only. Includes translation for 100 words.
                        </p>
                        <button
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            onClick={handleFreePlanClick}
                        >
                            Choose Free Testing Plan
                        </button>
                    </div>
                )}

                {/* Basic Plan */}
                <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center border hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold text-blue-600">
                        Basic Plan {subscriptionActive && "(Active)"}
                    </h2>
                    <p className="text-gray-600 text-center mt-2">
                        Perfect for apps looking for reliable and affordable translation
                        services.
                    </p>
                    <div className="mt-4 text-3xl font-bold text-gray-800">$2.00</div>
                    <p className="text-sm text-gray-500">/1000 words</p>
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Billed monthly. Includes translation for up to 1000 words per unit.
                    </p>
                    <button
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        onClick={handleBasicPlanClick}
                    >
                        Choose Basic Plan
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
                <p className="text-gray-600">
                    Need more information?{" "}
                    <a
                        href="mailto:support@auto-translate.com"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Contact our support team
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
