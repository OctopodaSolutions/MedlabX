param (
    [string]$SourceFile,
    [string]$DestinationFile
)

function Test-Admin {
    try {
        $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
        $principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)
        return $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
    } catch {
        return $false
    }
}

if (-not (Test-Admin)) {
    Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`" -SourceFile `"$SourceFile`" -DestinationFile `"$DestinationFile`"" -Verb RunAs
    exit
}

if (Test-Path -Path $SourceFile) {
    Copy-Item -Path $SourceFile -Destination $DestinationFile -Force
    Write-Output "Restored $SourceFile to $DestinationFile"
} else {
    Write-Output "Source file not found: $SourceFile"
}
