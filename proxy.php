<?php
  // put your API key here:
  $appid = "814ebc3f731b7528c102828ec630267e";

  header("Content-type: application/json\n\n");
  $params = $_SERVER['QUERY_STRING'];
  $host = "https://api.openweathermap.org/data/2.5/weather?$params&appid=$appid";
  $ch = curl_init($host);
  curl_exec($ch);
  curl_close($ch);
?>