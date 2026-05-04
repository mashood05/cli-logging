const CATEGORY_RULES = [
  { pattern: /^(git|gh)\s/, category: 'git' },
  { pattern: /^(npm|npx|yarn|pnpm)\s/, category: 'npm' },
  { pattern: /^(docker|docker-compose|podman)\s/, category: 'docker' },
  { pattern: /^(pip|pip3|python|py|uv|conda)\s/, category: 'python' },
  { pattern: /^(cargo|rustc|rustup)\s/, category: 'rust' },
  { pattern: /^(node|ts-node|tsx|nodemon)\s/, category: 'node' },
  { pattern: /^(go|gofmt)\s/, category: 'go' },
  { pattern: /^(java|javac|mvn|gradle)\s/, category: 'java' },
  { pattern: /^(dotnet|nuget)\s/, category: 'dotnet' },
  { pattern: /^(choco|winget|scoop|brew|apt|apt-get)\s/, category: 'package' },
  { pattern: /^(curl|wget|ping|tracert|nslookup|netstat|ssh|scp|ftp|telnet)\s/, category: 'network' },
  { pattern: /^(code|vim|nvim|nano|notepad|subl|atom)\s/, category: 'editor' },
  { pattern: /^(cd|ls|dir|pwd|mkdir|rmdir|rm|del|copy|move|ren|type|cat|echo|touch|find|which|where)\s/, category: 'filesystem' },
  { pattern: /^(Get-|Set-|New-|Remove-|Invoke-|Write-Output|Write-Host|Start-|Stop-|Test-|Import-|Export-|Out-|Select-|Where-|ForEach-|Format-)/i, category: 'powershell' },
  { pattern: /^(cls|clear|exit|history|help)\s*$/, category: 'system' },
  { pattern: /^(.\/|\.\.\/|\.\\)/, category: 'scripts' },
  { pattern: /^(set|setx|export|env)\s/, category: 'environment' },
  { pattern: /^(tasklist|taskkill|msiexec|reg|sc)\s/, category: 'system' },
  { pattern: /^(az|aws|gcloud|kubectl|helm|terraform)\s/, category: 'cloud' },
  { pattern: /^(ng|vue|create-react-app|next|nuxt)\s/, category: 'framework' },
]

function categorizeCommand(command) {
  const trimmed = command.trim()

  if (trimmed.startsWith('#')) {
    return 'comment'
  }

  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(trimmed)) {
      return rule.category
    }
  }

  return 'general'
}

module.exports = { categorizeCommand }
