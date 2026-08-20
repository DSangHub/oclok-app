async function loadStatus(userId) {
  const res = await fetch(`/api/v1/user/${userId}/status`);
  const data = await res.json();
  document.getElementById("status").textContent =
    `${data.status.toUpperCase()} • ${data.timezone}`;
  document.getElementById("next").textContent =
    data.nextOnline ? `Next online: ${data.nextOnline}` : "No upcoming window";
}
