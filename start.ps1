Write-Host "Starting Worker Node 1 on port 5001..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'worker-node'; `$env:PORT=5001; npm start`""

Write-Host "Starting Worker Node 2 on port 5002..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'worker-node'; `$env:PORT=5002; npm start`""

Write-Host "Starting Worker Node 3 on port 5003..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'worker-node'; `$env:PORT=5003; npm start`""

Write-Host "Starting Load Balancer on port 5000..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'load-balancer'; npm start`""

Write-Host "Starting React Dashboard..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'frontend'; npm run dev`""

Write-Host "All services started! The dashboard should open at http://localhost:5173"
