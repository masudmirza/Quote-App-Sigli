output "app_service_url" {
  description = "URL of the deployed application"
  value       = module.app_service.app_service_url
}

output "app_service_name" {
  description = "Name of the App Service"
  value       = module.app_service.app_service_name
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "postgres_fqdn" {
  description = "PostgreSQL server FQDN"
  value       = data.azurerm_postgresql_flexible_server.existing_postgres.fqdn
}