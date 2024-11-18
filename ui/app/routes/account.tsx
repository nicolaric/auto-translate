import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { requireUserSession } from "~/lib/utils/auth.server";

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
}): Promise<{ token: string; apiKeys: any[]; paymentStatus: unknown }> => {
  const session = await requireUserSession(request);
  const keysResponse = await fetch(
    "https://auto-translate.com/api/user/api-token",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.get("token")}`,
      },
    }
  );

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
    console.log(res);
    return res;
  };

  const apiKeys = await keysResponse.json();
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

  return { token: session.get("token") as string, apiKeys, paymentStatus };
};

export default function Account() {
  const [isCreateKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [isCopyKeyDialogOpen, setCopyKeyDialogOpen] = useState<
    { open: false } | { open: true; secret: string }
  >({ open: false });
  const [isDeleteKeyDialogOpen, setDeleteKeyDialogOpen] = useState<
    { open: false } | { open: true; id: string }
  >({ open: false });

  const openCreateKeyDialog = () => setCreateKeyDialogOpen(true);
  const closeCreateKeyDialog = () => setCreateKeyDialogOpen(false);

  const openCopyKeyDialog = (secret: string) =>
    setCopyKeyDialogOpen({ open: true, secret });
  const closeCopyKeyDialog = () => setCopyKeyDialogOpen({ open: false });

  const openDeleteKeyDialog = (id: string) =>
    setDeleteKeyDialogOpen({ open: true, id });
  const closeDeleteKeyDialog = () => setDeleteKeyDialogOpen({ open: false });

  let usage: string | undefined;

  const {
    token,
    apiKeys: initialApiKeys,
    paymentStatus,
  } = useLoaderData() as {
    token: string;
    apiKeys: any[];
    paymentStatus: any;
  };

  const [apiKeys, setApiKeys] = useState(initialApiKeys);

  const [keyName, setKeyName] = useState("");
  const handleChangeKeyName = (event) => setKeyName(event.target.value);

  const handleCreateKey = async () => {
    const name = keyName.trim();
    try {
      const newKeyRequest = await fetch(
        "https://auto-translate.com/api/user/api-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );
      setKeyName("");
      const newKey = await newKeyRequest.json();
      openCopyKeyDialog(newKey.token);
      closeCreateKeyDialog();
      setApiKeys([...apiKeys, newKey]);
    } catch (error) {
      console.error("Error creating API key:", error);
    }
  };

  const handleDeleteKey = async () => {
    try {
      const deleteKey = isDeleteKeyDialogOpen;
      if (!deleteKey.open) return;

      const deleteReq = await fetch(
        `https://auto-translate.com/api/user/api-token/${deleteKey.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await deleteReq.json();

      setApiKeys([...apiKeys.filter((ak) => ak.id !== deleteKey.id)]);
      closeDeleteKeyDialog();
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  const loadUsageLink = async () => {
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

    window.open(usageLink.url, "_blank");
    usage = usageLink.url;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <a href="." className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="logo.png" alt="Auto Translate" />
          </div>
          <span className="text-xl font-bold">Auto Translate</span>
        </a>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Your Account</h1>

        {!paymentStatus.data?.length && (
          <div className="bg-yellow-100 p-4 text-yellow-900 rounded-md text-center mb-6">
            You are still on the limited free plan. Consider switching to a paid
            plan to continue using the service.{" "}
            <a href="/pricing" className="text-blue-600">
              View pricing
            </a>
          </div>
        )}

        {/* Tabs */}
        <TabGroup>
          <TabList className="flex space-x-2 bg-gray-200 p-2 rounded-md">
            <Tab
              className={({ selected }) =>
                selected
                  ? "bg-blue-600 text-white px-4 py-2 rounded-md"
                  : "bg-white text-gray-600 px-4 py-2 rounded-md"
              }
            >
              API Keys
            </Tab>
            <Tab
              className={({ selected }) =>
                selected
                  ? "bg-blue-600 text-white px-4 py-2 rounded-md"
                  : "bg-white text-gray-600 px-4 py-2 rounded-md"
              }
              onClick={loadUsageLink}
            >
              Usage and Subscription
            </Tab>
          </TabList>

          <TabPanels>
            {/* API Keys Tab */}
            <TabPanel className="mt-6">
              <button
                onClick={openCreateKeyDialog}
                className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
              >
                + Create New API Key
              </button>

              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Last Used</th>
                    <th className="border border-gray-300 p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys?.map((key, index) => (
                    <tr key={key.id || index}>
                      {" "}
                      {/* Use a unique key, e.g., key.id */}
                      <td className="border border-gray-300 p-2">
                        {key.name || "Unknown Key"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {key.lastUsed || "Never Used"}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        <button
                          onClick={() => openDeleteKeyDialog(key.id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>

            {/* Usage and Subscription Tab */}
            <TabPanel className="mt-6">
              <div className="text-gray-700">
                {paymentStatus.freeTier && (
                  <div>
                    <b>Free Trial</b>
                    <p>
                      {paymentStatus.usage}/100 words translated. Update to a
                      paid plan to continue using the service here:{" "}
                      <a href="/pricing" className="text-blue">
                        View pricing
                      </a>
                    </p>
                  </div>
                )}
                {!paymentStatus.freeTier && (
                  <div>
                    <a href={usage}>View usage</a>
                  </div>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {/* Create Key Dialog */}
      {isCreateKeyDialogOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New API Key</h2>
            <input
              type="text"
              placeholder="Enter API key name"
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              value={keyName}
              onChange={handleChangeKeyName}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeCreateKeyDialog}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleCreateKey}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Key Dialog */}
      {isCopyKeyDialogOpen.open && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Save Your API Key</h2>
            <p className="text-gray-600 mb-4">
              Please save this secret key somewhere safe and accessible. You
              won&apos;t be able to view it again.
            </p>
            <input
              type="text"
              value={isCopyKeyDialogOpen.secret}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              readOnly
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeCopyKeyDialog}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Key Dialog */}
      {isDeleteKeyDialogOpen.open && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete API Key</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this API key?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeDeleteKeyDialog}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleDeleteKey}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
