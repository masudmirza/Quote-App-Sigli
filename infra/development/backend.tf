terraform {
  backend "azurerm" {
    resource_group_name  = "rg-quoteapp-tfstate"
    storage_account_name = "quoteapptfs1753203539"
    container_name       = "tfstate"
    key                  = "development.tfstate"
    use_oidc             = true
  }
}