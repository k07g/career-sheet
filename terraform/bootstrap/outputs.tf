output "state_bucket_name" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "github_actions_role_arn" {
  description = "environments/dev の apply をCIから行う際にAssumeRoleするロールのARN"
  value       = aws_iam_role.terraform_ci.arn
}

output "github_oidc_provider_arn" {
  value = local.github_oidc_provider_arn
}
