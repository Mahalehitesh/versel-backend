$body = @{ username = 'admin'; password = 'admin123' } | ConvertTo-Json
$login = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -ContentType 'application/json' -Body $body
$h = @{ Authorization = "Bearer $($login.token)" }

Write-Host "Testing admin accessing Classroom 1 via /api/teacher/classrooms/1:"
try {
    $res = Invoke-RestMethod -Uri "http://localhost:8080/api/teacher/classrooms/1" -Headers $h
    Write-Host "SUCCESS: Name='$($res.name)', Subject='$($res.subject)', Term='$($res.term.name)'"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}
