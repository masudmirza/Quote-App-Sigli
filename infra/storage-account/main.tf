resource "azurerm_storage_account" "main" {
  name                     = "st${replace(var.app_name, "-", "")}${var.environment}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = var.account_tier
  account_replication_type = var.replication_type

  # Security settings
  https_traffic_only_enabled      = true
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false

  blob_properties {
    versioning_enabled = var.enable_versioning
    delete_retention_policy {
      days = var.blob_retention_days
    }
  }

  tags = var.tags
}

resource "azurerm_storage_container" "app_files" {
  name                  = "app-files"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "logs" {
  name                  = "logs"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}