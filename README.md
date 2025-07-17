# FinalProject
finally
# SmartShoop
$query = '{"products":["חלב","אורז"]}'
$encodedQuery = [System.Text.Encoding]::UTF8.GetBytes($query)
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/search" -ContentType "application/json" -Body $encodedQuery -OutFile "response.json"

curl.exe -X POST http://localhost:3000/api/search -H "Content-Type: application/json" > response.json -d '{"products":["חלב","אורז"]}'
curl -X POST http://localhost:3001/api/search -H "Content-Type: application/json" -d '{"products":["חלב","אורז"]}' -o response.json

curl.exe -X POST http://localhost:3000/api/search -H "Content-Type: application/json" -d '{"products":["חלב","אורז"]}' -o response.json
& curl.exe -X POST http://localhost:3000/api/search -H 'Content-Type: application/json' -d '{"products":["חלב","אורז"]}' -o response.json
