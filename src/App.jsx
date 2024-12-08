import React, { useState } from "react";
import { Button, Typography, Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [timezone, setTimezone] = useState(""); 
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const timezones = [
    "Africa/Cairo",
    "Asia/Tokyo",
    "America/Los_Angeles",
    "Europe/London",
    "Australia/Sydney",
  ];

  function getLocation() {
    if (!navigator.geolocation) {
      setError("お使いのブラウザでは位置情報がサポートされていません");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setError("");
      },
      () => {
        setError("位置情報の取得に失敗しました。位置情報へのアクセスを許可してください。");
      }
    );
  }

  async function fetchWeather() {
    if (!latitude || !longitude || !timezone) {
      setError("緯度、経度、またはタイムゾーンが選択されていません。");
      return;
    }

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=temperature_2m_max,temperature_2m_min`
      );
      const data = await response.json();
      setWeather(data.daily);
      setError("");
    } catch {
      setError("気象データの取得に失敗しました。");
    }
  }

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial", maxWidth: "600px", margin: "0 auto" }}>
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6">日本大学文理学部情報科学科 Webプログラミングの演習課題</Typography>
        <Typography variant="subtitle1">氏名: 伊藤数真</Typography>
        <Typography variant="subtitle1">学生証番号: 5423085</Typography>
      </Box>

      <Typography variant="h4" gutterBottom>
        天気予報アプリ
      </Typography>

      <Button variant="contained" onClick={getLocation} sx={{ marginBottom: "20px" }}>
        現在位置を取得する
      </Button>

      {latitude && longitude && (
        <Box sx={{ marginBottom: "20px" }}>
          <Typography>緯度: {latitude}</Typography>
          <Typography>経度: {longitude}</Typography>
        </Box>
      )}

      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel id="timezone-select-label">タイムゾーン</InputLabel>
        <Select
          labelId="timezone-select-label"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {timezones.map((zone) => (
            <MenuItem key={zone} value={zone}>
              {zone}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={fetchWeather}
        sx={{ marginBottom: "20px", display: "block" }}
      >
        天気予報を取得する
      </Button>

      {error && (
        <Typography color="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Typography>
      )}

      {weather && (
        <Box>
          <Typography variant="h5" gutterBottom>
            7日間の天気予報
          </Typography>
          <ul>
            {weather.time.map((date, index) => (
              <li key={date}>
                <Typography>
                  <strong>{date}</strong>: 最低気温 {weather.temperature_2m_min[index]}°C, 最高気温 {weather.temperature_2m_max[index]}°C
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}

export default App;