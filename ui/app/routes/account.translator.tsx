import { CircleNotch } from "@phosphor-icons/react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { useToast } from "~/lib/components/toast";
import { requireUserSession } from "~/lib/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Translator - Auto Translate" },
    { name: "description", content: "Translator on Auto Translate" },
  ];
};

export const loader = async ({
  request,
}: {
  request: Request;
}): Promise<Response> => {
  const session = await requireUserSession(request);

  return Response.json({
    token: session.get("token") as string,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const sourceJson = String(formData.get("sourceJson"));
  const sourceLanguage = String(formData.get("sourceLanguage"));
  const targetLanguage = String(formData.get("targetLanguage"));

  const errors: Record<string, string> = {};

  try {
    JSON.parse(sourceJson);
  } catch {
    errors.sourceJson = "Invalid JSON, please check your input";
  }

  if (!sourceLanguage) {
    errors.sourceLanguage = "Please select source language";
  }

  if (!targetLanguage) {
    errors.targetLanguage = "Please select target language";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors });
  }

  const session = await requireUserSession(request);

  const translateReq = await fetch("https://auto-translate.com/api/translate", {
    method: "POST",
    body: JSON.stringify({
      sourceLanguage,
      targetLanguage,
      sourceFile: sourceJson,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.get("token")}`,
    },
  });

  return Response.json({
    errors: {
      api: !translateReq.ok && (await translateReq.json()),
    },
    ...(translateReq.ok ? { targetJson: await translateReq.json() } : {}),
  });
}

export default function Account() {
  const { showToast } = useToast();

  const actionData = useActionData<typeof action>();

  const [isLoading, setLoading] = useState(false);

  if (actionData && isLoading) {
    setLoading(false);
    if (actionData.errors?.api) {
      showToast(actionData.errors.api?.error, "error");
    }
  }

  const supportedLanguages = [
    { code: "", name: "Please choose language" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "pt", name: "Portuguese" },
    { code: "de", name: "German" },
    { code: "zh", name: "Mandarin Chinese" },
    { code: "hi", name: "Hindi" },
    { code: "ar", name: "Arabic" },
    { code: "bn", name: "Bengali" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "tr", name: "Turkish" },
    { code: "vi", name: "Vietnamese" },
    { code: "it", name: "Italian" },
    { code: "pl", name: "Polish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ta", name: "Tamil" },
    { code: "mr", name: "Marathi" },
    { code: "te", name: "Telugu" },
    { code: "ms", name: "Malay" },
    { code: "fa", name: "Persian" },
    { code: "sw", name: "Swahili" },
    { code: "ha", name: "Hausa" },
    { code: "id", name: "Indonesian" },
    { code: "th", name: "Thai" },
    { code: "gu", name: "Gujarati" },
    { code: "pa", name: "Punjabi" },
    { code: "yo", name: "Yoruba" },
    { code: "am", name: "Amharic" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Form method="post">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="source-language">Select source language</label>
            <select
              id="source-language"
              name="sourceLanguage"
              className="border border-gray-200 rounded-md p-2"
            >
              {supportedLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>{" "}
            {actionData?.errors?.sourceLanguage ? (
              <em className="text-red-600">
                {actionData?.errors.sourceLanguage}
              </em>
            ) : null}
          </div>
          <div className="flex flex-col">
            <label htmlFor="source-json">Source JSON</label>
            <textarea
              id="source-json"
              name="sourceJson"
              className="border border-gray-200 rounded-md p-2 font-mono"
              rows={10}
              placeholder="Enter JSON to translate"
            ></textarea>
            {actionData?.errors?.sourceJson ? (
              <em className="text-red-600">{actionData?.errors.sourceJson}</em>
            ) : null}
          </div>
          <div className="flex flex-col">
            <label htmlFor="language-selector">Select target language</label>
            <select
              id="target-language"
              name="targetLanguage"
              className="border border-gray-200 rounded-md p-2"
            >
              {supportedLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
            {actionData?.errors?.targetLanguage ? (
              <em className="text-red-600">
                {actionData?.errors.targetLanguage}
              </em>
            ) : null}
          </div>
          <button
            type="submit"
            onClick={() => setLoading(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {!isLoading ? (
              "Translate"
            ) : (
              <CircleNotch size={16} className="animate-spin" />
            )}
          </button>
        </div>
      </Form>
      {actionData?.targetJson && (
        <div className="bg-gray-200 rounded-md p-4">
          <div className="text-xl">Translated JSON</div>
          <pre>{actionData.targetJson.translation}</pre>
        </div>
      )}
    </div>
  );
}
