output "amplify_app_id" {
  value = aws_amplify_app.this.id
}

output "default_domain" {
  description = "Amplifyが割り当てるドメイン (実際のURLは https://main.<default_domain>)"
  value       = aws_amplify_app.this.default_domain
}

output "app_url" {
  value = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.this.default_domain}"
}
