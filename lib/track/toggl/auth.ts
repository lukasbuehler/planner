async function createTogglSessionWithAPIKey() {
  await fetch("https://api.track.toggl.com/api/v9/me/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + btoa(process.env.NEXT_PUBLIC_TOGGL_API_TOKEN + ":api_token"),
    },
  });
}

export async function authorize() {
  await createTogglSessionWithAPIKey();
}
