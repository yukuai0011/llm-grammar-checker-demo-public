export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  config: LLMConfig,
  messages: ChatMessage[]
): Promise<string> {
  const url = `${config.baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0,
    }),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Authentication failed. Check your API key.");
    }
    if (res.status === 429) {
      throw new Error("Rate limited. Please wait and try again.");
    }
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error(
      "The LLM returned an unexpected format. Try again or try a different model."
    );
  }

  return content;
}
