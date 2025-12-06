# Test script for both successful and error requests
# This script tests both request logging and error logging

Write-Host "=== Testing Request Logging ===" -ForegroundColor Cyan
Write-Host "Sending GET request to /healthz..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri http://localhost:8080/healthz -Method GET
    Write-Host "Success! Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n=== Testing Error Logging ===" -ForegroundColor Cyan
Write-Host "Sending invalid NL command..." -ForegroundColor Yellow

$body = @{
    text = "invalid command"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri http://localhost:8080/nl/execute -Method POST -ContentType "application/json" -Body $body
    Write-Host "Unexpected success:" -ForegroundColor Yellow
    $response | ConvertTo-Json
} catch {
    Write-Host "Error occurred (expected):" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error response:" -ForegroundColor Red
        $errorJson | ConvertTo-Json
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host "`n=== Check your backend console for structured JSON logs! ===" -ForegroundColor Cyan
Write-Host "You should see:" -ForegroundColor Cyan
Write-Host "  - Request logs with method, url, correlationId, statusCode" -ForegroundColor Cyan
Write-Host "  - Error logs with message, stack, correlationId" -ForegroundColor Cyan

