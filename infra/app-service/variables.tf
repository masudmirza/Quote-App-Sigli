variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "sku_name" {
  description = "App Service Plan SKU"
  type        = string
  default     = "B2"
}

variable "node_version" {
  description = "Node.js version"
  type        = string
  default     = "20-lts"
}

variable "always_on" {
  description = "Always on setting"
  type        = bool
  default     = true
}

variable "health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/health"
}

variable "app_settings" {
  description = "App settings"
  type        = map(string)
  default     = {}
}

variable "connection_strings" {
  description = "Connection strings"
  type = list(object({
    name  = string
    type  = string
    value = string
  }))
  default = []
}

variable "tags" {
  description = "Tags"
  type        = map(string)
  default     = {}
}