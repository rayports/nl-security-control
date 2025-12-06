# Test script for error logging
# This script sends an invalid NL command to trigger error logging

Write-Host "Testing error logging with invalid command..." -ForegroundColor Yellow

$body = @{
    text = "invalid command"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri http://localhost:8080/nl/execute -Method POST -ContentType "application/json" -Body $body
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Error occurred (expected):" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

Write-Host "`nCheck your backend console for structured JSON error logs!" -ForegroundColor Cyan

