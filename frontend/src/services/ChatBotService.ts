export const sendChat = async (userInput: string): Promise<string[]> => {
  try {
    const res = await fetch("http://localhost:8000/planner/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ text: userInput }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.response;
  } catch {
    console.error("Planner API error");
    return ["Failed to connect to planner endpoint."];
  }
};
