variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "quoteapp"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "development"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "West Europe"
}

variable "app_service_sku" {
  description = "App Service Plan SKU"
  type        = string
  default     = "F1"
}

variable "node_version" {
  description = "Node.js version"
  type        = string
  default     = "20-lts"
}

# Existing PostgreSQL variables
variable "postgres_server_name" {
  description = "Name of existing PostgreSQL server"
  type        = string
}

variable "postgres_resource_group_name" {
  description = "Resource group of existing PostgreSQL server"
  type        = string
}

variable "postgres_database_name" {
  description = "PostgreSQL database name"
  type        = string
}

variable "postgres_admin_username" {
  description = "PostgreSQL admin username"
  type        = string
}

variable "postgres_admin_password" {
  description = "PostgreSQL admin password"
  type        = string
  sensitive   = true
}


variable "jwt_secret" {
  description = "Secret key for JWT token signing"
  type        = string
  sensitive   = true
}

variable "quote_api_url" {
  description = "URL for the external quote API"
  type        = string
}
