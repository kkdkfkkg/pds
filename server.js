import express from "express";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Aspose API 인증 정보 (환경변수 사용)
const CLIENT_ID = process.env.ASPOSE_CLIENT_ID;
const CLIENT_SECRET = process.env.ASPOSE_CLIENT_SECRET;
let ACCESS_TOKEN = "";

// 토큰 발급
async function getAccessToken() {
  if (ACCESS_TOKEN) return ACCESS_TOKEN;
  const url = "https://api.aspose.cloud/connect/token";
  const form = new FormData();
  form.append("grant_type", "client_credentials");
  form.append("client_id", CLIENT_ID);
  form.append("client_secret", CLIENT_SECRET);

  const res = await axios.post(url, form, { headers: form.getHeaders() });
  ACCESS_TOKEN = res.data.access_token;
  return ACCESS_TOKEN;
}

// PSD 수정 API
app.post("/api/edit", async (req, res) => {
  try {
    const { layerData } = req.body;
    const token = await getAccessToken();

    const psdFile = "dkdlvhs.psd"; // 관리자 업로드 PSD 파일명
    const url = `https://api.aspose.cloud/v4.0/psd/${psdFile}/saveAs/png`;

    const response = await axios.post(
      url,
      {
        layers: Object.entries(layerData).map(([layerName, value]) => ({
          name: layerName,
          text: value
        }))
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ imageUrl: response.data.href });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "PSD 편집 실패" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));