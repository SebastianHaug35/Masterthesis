$ErrorActionPreference = "Stop"

$baseUrl = "http://127.0.0.1:8088"

$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
$po = Invoke-RestMethod -Uri "$baseUrl/erp/purchase-orders/by-po/PO-4500012458" -Method Get
$invoice = Invoke-RestMethod -Uri "$baseUrl/email/invoice/by-po/PO-4500012458" -Method Get
$complete = Invoke-RestMethod -Uri "$baseUrl/dms/completeness/case/AP-2026-0001" -Method Get
$stamp = Invoke-RestMethod `
  -Uri "$baseUrl/dms/stamp" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{ case_id = "AP-2026-0001" } | ConvertTo-Json -Compress)
$archive = Invoke-RestMethod `
  -Uri "$baseUrl/dms/archive" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{ case_id = "AP-2026-0001" } | ConvertTo-Json -Compress)

[PSCustomObject]@{
  health = $health.data.status
  po_number = $po.data.po_number
  invoice_number = $invoice.data.invoice.invoice_number
  complete = $complete.data.all_documents_amended
  stamp_status = $stamp.data.stamp_status
  archive_location = $archive.data.archive_location
}
