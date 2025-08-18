document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const layerData = {};
  formData.forEach((value, key) => {
    layerData[key] = value;
  });

  const res = await fetch("/api/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ layerData })
  });

  const data = await res.json();
  if (data.imageUrl) {
    document.getElementById("result").innerHTML = `
      <p>변환 완료!</p>
      <img src="${data.imageUrl}" alt="결과 이미지">
      <a href="${data.imageUrl}" download>다운로드</a>
    `;
  } else {
    document.getElementById("result").innerText = "오류 발생: " + data.error;
  }
});