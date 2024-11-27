import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/lib/utils/auth.server";
import { logEvent } from "~/lib/utils/logs";

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
  logEvent("usage_page_viewed", undefined);
  const session = await requireUserSession(request);

  const paymentStatusReq = await fetch(
    "https://auto-translate.com/api/payment/status",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.get("token")}`,
      },
    }
  );
  const paymentStatus = await paymentStatusReq.json();

  const usageLinkReq = await fetch(
    `https://auto-translate.com/api/payment/usage-link`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.get("token")}`,
      },
    }
  );

  const usageLink = await usageLinkReq.json();

  return Response.json({ usageLink, paymentStatus });
};

export default function Account() {
  const { usageLink, paymentStatus } = useLoaderData() as {
    paymentStatus: any;
    usageLink: { url: string } | undefined;
  };

  return (
    <div className="mt-6">
      <div className="text-gray-700">
        {paymentStatus.freeTier && (
          <div>
            <b>Free Trial</b>
            <p>
              {paymentStatus.usage}/100 words translated. Update to a paid plan
              to continue using the service here:{" "}
              <a href="/pricing" className="text-blue">
                View pricing
              </a>
            </p>
          </div>
        )}
        {!paymentStatus.freeTier && (
          <div>
            {usageLink && usageLink.url && (
              <a href={usageLink.url} target="_blank" rel="noreferrer">
                View usage
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
