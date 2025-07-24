terraform {
  required_version = ">= 1.5"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# Data sources for existing resources
data "azurerm_postgresql_flexible_server" "existing_postgres" {
  name                = var.postgres_server_name
  resource_group_name = var.postgres_resource_group_name
}


# Main resource group for the development environment
resource "azurerm_resource_group" "main" {
  name     = "rg-${var.app_name}-${var.environment}"
  location = var.location

  tags = local.common_tags
}

# App Service using our module
module "app_service" {
  source = "../app-service"

  app_name            = var.app_name
  environment         = var.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku_name            = var.app_service_sku
  node_version        = var.node_version

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "NODE_ENV"                            = "production"
    "PORT"                                = var.HTTP_PORT
    "WEBSITE_NODE_DEFAULT_VERSION"        = var.node_version

    # Database connection
    "DATABASE_URL" = var.database_url
    "POSTGRES_HOST" = var.postgres_host
  }

  connection_strings = [
    {
      name  = "DefaultConnection"
      type  = "PostgreSQL"
      value = local.postgres_connection_string
    }
  ]

  tags = local.common_tags
}

# Storage Account
module "storage_account" {
  source = "../storage-account"

  app_name            = var.app_name
  environment         = var.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  tags = local.common_tags
}

# Local values for computed strings
locals {
  common_tags = {
    Environment = var.environment
    Application = var.app_name
    ManagedBy   = "Terraform"
    CreatedDate = formatdate("YYYY-MM-DD", timestamp())
  }

  database_url = "postgresql://${var.postgres_admin_username}:${var.postgres_admin_password}@${data.azurerm_postgresql_flexible_server.existing_postgres.fqdn}:5432/${var.postgres_database_name}?sslmode=require"

  postgres_connection_string = "Server=${data.azurerm_postgresql_flexible_server.existing_postgres.fqdn};Database=${var.postgres_database_name};Port=5432;User Id=${var.postgres_admin_username};Password=${var.postgres_admin_password};Ssl Mode=Require;"
}
