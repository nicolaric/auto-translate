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
}): Promise<Response> => {
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

  const apiKeys = await keysResponse.json();

  return Response.json({
    token: session.get("token") as string,
    apiKeys,
  });
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

  const { token, apiKeys: initialApiKeys } = useLoaderData() as {
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

  return (
    <div>
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
              value={isCopyKeyDialogOpen?.secret}
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
